package mongocalls

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"time"

	users "Solutions/pvpSimulator/core/users"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

//Session contains user session info
type Session struct {
	SessionID string `bson:"sessId,omitempty"`

	AccessToken string `bson:"aToken,omitempty"`
	AccessExp   int64  `bson:"aExp,omitempty"`

	RefreshToken string `bson:"rToken,omitempty"`
	RefreshExp   int64  `bson:"rExp,omitempty"`

	SessionFingerprint string `bson:"sessFing,omitempty"`
	Browser            string `bson:"browser,omitempty"`
	Os                 string `bson:"os,omitempty"`
	IP                 string `bson:"ip,omitempty"`
}

//User contains user info
type User struct {
	ID       string    `bson:"_id,omitempty"`
	Username string    `bson:"username,omitempty"`
	Password string    `bson:"password,omitempty"`
	Email    string    `bson:"email,omitempty"`
	RegAt    int64     `bson:"regat,omitempty"`
	Sessions []Session `bson:"session,omitempty"`
}

//CheckUserExistance checks user existance
func CheckUserExistance(clent *mongo.Client, form *users.RegForm) error {
	usersColl := clent.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	filterCursor, err := usersColl.Find(ctx, bson.M{
		"$or": []interface{}{
			bson.M{"username": form.Username},
			bson.M{"email": form.Email},
		}})
	if err != nil {
		return err
	}
	var users []User
	if err = filterCursor.All(ctx, &users); err != nil {
		return err
	}
	if len(users) > 0 {
		return fmt.Errorf(makeErrString(users, form))
	}
	return nil
}

func makeErrString(users []User, form *users.RegForm) string {
	var str string
	for _, val := range users {
		if form.Username == val.Username {
			str += "Username already exists in the database, choose another username"
		}
	}
	for _, val := range users {
		if form.Email == val.Email {
			if str != "" {
				str += "; "
			}
			str += "Email already exists in the database, choose another email"
		}
	}
	return str
}

//Signup creates new user
func Signup(clent *mongo.Client, form *users.RegForm) (string, error) {
	usersColl := clent.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	id := uuid.New().String()
	_, err := usersColl.InsertOne(ctx, User{
		ID:       id,
		Username: form.Username,
		Password: form.Password,
		Email:    form.Email,
		RegAt:    time.Now().Unix(),
		Sessions: []Session{},
	})
	if err != nil {
		return "", err
	}
	return id, nil
}

//NewSession creates new session
func NewSession(clent *mongo.Client, sess Session, id string) (*Tokens, error) {
	tok := sess.generateTokens(id)
	if err := replaceSession(clent, []Session{sess}, id); err != nil {
		return nil, err
	}
	return tok, nil
}

func replaceSession(clent *mongo.Client, sessions []Session, id string) error {
	usersColl := clent.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_, err := usersColl.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"session": sessions,
		}},
	)
	if err != nil {
		return err
	}
	return nil
}

func (s *Session) generateTokens(id string) *Tokens {
	tok := new(Tokens)
	tok.startSession(id)
	s.AccessToken = tok.AToken.Token
	s.RefreshToken = tok.RToken.Token
	s.SessionID = tok.SessionID
	s.AccessExp = tok.AToken.Expires
	s.RefreshExp = tok.RToken.Expires
	return tok
}

//Tokens contains access and refresh tokens
type Tokens struct {
	SessionID string

	AToken SingleToken
	RToken SingleToken
}

//SingleToken contains single token information
type SingleToken struct {
	Token   string
	Expires int64
}

func (t *Tokens) startSession(uid string) error {
	t.SessionID = uuid.New().String()
	if err := t.newAccess(uid); err != nil {
		return err
	}
	if err := t.newRefresh(uid); err != nil {
		return err
	}
	return nil
}

func (t *Tokens) newRefresh(uid string) error {
	//lifetime
	t.RToken.Expires = time.Now().Add(time.Second * 2592000).Unix()
	//token body
	var err error
	atClaims := jwt.MapClaims{}
	atClaims["u_id"] = uid
	atClaims["s_id"] = t.SessionID
	atClaims["exp_at"] = t.RToken.Expires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	t.RToken.Token, err = at.SignedString([]byte(os.Getenv("JWT_KEY")))
	if err != nil {
		return err
	}
	return nil
}

func (t *Tokens) newAccess(uid string) error {
	//lifetime
	t.AToken.Expires = time.Now().Add(time.Second * 7200).Unix()
	//token body
	var err error
	atClaims := jwt.MapClaims{}
	atClaims["u_id"] = uid
	atClaims["s_id"] = t.SessionID
	atClaims["exp_at"] = t.AToken.Expires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	t.AToken.Token, err = at.SignedString([]byte(os.Getenv("JWT_KEY")))
	if err != nil {
		return err
	}
	return nil
}

func newBase64(str string) string {
	h := sha256.Sum256([]byte(str))
	return base64.StdEncoding.EncodeToString(h[:])
}

//Signin creates new session for user if creditinail are right
func Signin(clent *mongo.Client, form *users.RegForm, sess Session) (*Tokens, error) {
	currUser := lookupUser(clent, bson.M{"username": form.Username, "password": form.Password})
	if currUser == nil {
		return nil, fmt.Errorf("Incorrect username and / or password")
	}
	tok := sess.generateTokens(currUser.ID)
	currUser.addSession(sess)
	if err := replaceSession(clent, currUser.Sessions, currUser.ID); err != nil {
		return nil, err
	}

	return tok, nil
}

func lookupUser(clent *mongo.Client, query bson.M) *User {
	usersColl := clent.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	filterCursor := usersColl.FindOne(ctx, query)
	currUser := User{}
	if err := filterCursor.Decode(&currUser); err != nil {
		return nil
	}
	if currUser.ID == "" {
		return nil
	}
	return &currUser
}

func (u *User) addSession(sess Session) {
	if u.Sessions == nil {
		u.Sessions = make([]Session, 0, 1)
	}
	if len(u.Sessions) >= 5 {
		u.Sessions = u.Sessions[1:5]
	}
	u.Sessions = append(u.Sessions, sess)
}

//Refresh refreshes user session if creditinail are right
func Refresh(clent *mongo.Client, sess Session, cookie *http.Cookie) (*Tokens, string, error) {
	jwt, err := decodeRefresh(cookie.Value)
	if err != nil {
		fmt.Println(err)
		return nil, "", fmt.Errorf("Invalid auth token")
	}
	//check uid
	uID, ok := (*jwt)["u_id"].(string)
	if !ok {
		return nil, "", fmt.Errorf("Invalid auth token")
	}
	//find user
	currUser := lookupUser(clent, bson.M{"_id": uID})
	if currUser == nil {
		return nil, "", fmt.Errorf("Invalid auth token")
	}
	//check session
	sID, ok := (*jwt)["s_id"].(string)
	if !ok {
		return nil, "", fmt.Errorf("Invalid auth token")
	}
	//find session
	currSession := currUser.deleteSession(sID)
	if currSession == nil {
		return nil, "", fmt.Errorf("Session not found")
	}

	switch currSession.verifyRefresh(sess.SessionFingerprint, cookie.Value) {
	case true:
		tok := sess.generateTokens(currUser.ID)
		currUser.addSession(sess)
		if err := replaceSession(clent, currUser.Sessions, currUser.ID); err != nil {
			return nil, "", err
		}
		return tok, currUser.Username, nil
	default:
		if err := replaceSession(clent, currUser.Sessions, currUser.ID); err != nil {
			return nil, "", err
		}
		return nil, "", fmt.Errorf("Verification failed")
	}
}

func (s *Session) verifyRefresh(fPrint, token string) bool {
	if s.RefreshToken != token {
		return false
	}
	if s.SessionFingerprint != fPrint {
		return false
	}
	if s.RefreshExp < time.Now().Unix() {
		return false
	}
	return true
}

//deleteSession deletes session from array and return deleted session
func (u *User) deleteSession(sID string) *Session {
	if u.Sessions == nil {
		return nil
	}
	if len(u.Sessions) > 5 {
		u.Sessions = u.Sessions[0:5]
	}
	for key, value := range u.Sessions {
		if value.SessionID == sID {
			u.Sessions = append(u.Sessions[:key], u.Sessions[key+1:]...)
			return &value
		}
	}
	return nil
}

func decodeRefresh(refresh string) (*jwt.MapClaims, error) {
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(refresh, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_KEY")), nil
	})
	if err != nil {
		return nil, err
	}
	return &claims, nil
}

//help-functions to test functionality *********************************************************************************************

func RetriveAction(clent *mongo.Client) ([]User, error) {
	usersColl := clent.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	cursor, err := usersColl.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	var users []User
	if err = cursor.All(ctx, &users); err != nil {
		return nil, err
	}
	return users, nil
}

func DeleteAllAction(clent *mongo.Client) error {
	usersColl := clent.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := usersColl.Drop(ctx); err != nil {
		return err
	}
	return nil
}
