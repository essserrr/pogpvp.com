package userauth

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"time"

	users "Solutions/pvpSimulator/core/users"

	"github.com/sethvargo/go-password/password"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

//UsernameEmail username and email
type usernameEmail struct {
	Username string `bson:"username,omitempty"`
	Email    string `bson:"email,omitempty"`
}

//CheckUserExistance checks user existance
func CheckUserExistance(client *mongo.Client, form *users.SubmitForm) error {
	usersColl := client.Database("pogpvp").Collection("users")
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
	var users []usernameEmail
	if err = filterCursor.All(ctx, &users); err != nil {
		return err
	}
	if len(users) > 0 {
		return fmt.Errorf(makeErrString(&users, form))
	}
	return nil
}

func makeErrString(users *[]usernameEmail, form *users.SubmitForm) string {
	var str string
	for _, val := range *users {
		if len(*users) > 1 && str != "" {
			str += "; "
		}
		switch true {
		case form.Username == val.Username:
			str += "Username already exists in the database, choose another username"
		case form.Email == val.Email:
			str += "Email already exists in the database, choose another email"
		}
	}
	return str
}

//Signup creates a new user
func Signup(client *mongo.Client, form *users.SubmitForm) (string, error) {
	usersColl := client.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	id := uuid.New().String()
	_, err := usersColl.InsertOne(ctx, users.User{
		ID:       id,
		Username: form.Username,
		Password: form.Password,
		Email:    form.Email,
		RegAt:    time.Now().Unix(),
	})
	if err != nil {
		return "", err
	}
	return id, nil
}

//NewSession creates new session
func NewSession(client *mongo.Client, sess users.Session, id string) (*users.Tokens, error) {
	tok := sess.GenerateTokens(id)
	if err := users.UpdateUser(client, id, bson.M{"$set": bson.M{"session": []users.Session{sess}}}); err != nil {
		return nil, err
	}
	return tok, nil
}

//UserSessions contains user sessions info
type userSessions struct {
	ID       string          `bson:"_id,omitempty"`
	Username string          `bson:"username,omitempty"`
	Sessions []users.Session `bson:"session,omitempty"`
}

func (u *userSessions) addSession(sess users.Session) {
	if u.Sessions == nil {
		u.Sessions = make([]users.Session, 0, 1)
	}
	if len(u.Sessions) >= 5 {
		u.Sessions = u.Sessions[1:5]
	}
	u.Sessions = append(u.Sessions, sess)
}

//deleteSession deletes session from array and return deleted session
func (u *userSessions) deleteSession(sid string) *users.Session {
	if u.Sessions == nil {
		return nil
	}
	if len(u.Sessions) > 5 {
		u.Sessions = u.Sessions[0:5]
	}
	for key, value := range u.Sessions {
		if value.SessionID == sid {
			u.Sessions = append(u.Sessions[:key], u.Sessions[key+1:]...)
			return &value
		}
	}
	return nil
}

//Signin creates new session for user if creditinail are right
func Signin(client *mongo.Client, form *users.SubmitForm, sess users.Session) (*users.Tokens, error) {
	currUser := new(userSessions)
	if err := users.LookupUser(client, bson.M{"username": form.Username, "password": form.Password}, currUser); err != nil {
		return nil, fmt.Errorf("Incorrect username and / or password")
	}
	if currUser.ID == "" {
		return nil, fmt.Errorf("Incorrect username and / or password")
	}
	tok := sess.GenerateTokens(currUser.ID)
	currUser.addSession(sess)

	if err := users.UpdateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
		return nil, err
	}
	return tok, nil
}

func parseFromToken(token string) (*users.AccessSession, error) {
	jwt, err := decodeToken(token)
	if err != nil {
		return nil, fmt.Errorf("Invalid token format")
	}
	ids := new(users.AccessSession)
	var ok bool
	//check uid
	ids.UserID, ok = (*jwt)["u_id"].(string)
	if !ok {
		return nil, fmt.Errorf("Invalid token format")
	}
	//check session
	ids.SessionID, ok = (*jwt)["s_id"].(string)
	if !ok {
		return nil, fmt.Errorf("Invalid token format")
	}
	ids.AccessToken = token

	return ids, nil
}

func decodeToken(refresh string) (*jwt.MapClaims, error) {
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(refresh, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_KEY")), nil
	})
	if err != nil {
		return nil, err
	}
	return &claims, nil
}

//Refresh refreshes user session if creditinails are right
func Refresh(client *mongo.Client, sess users.Session, cookie *http.Cookie) (*users.Tokens, string, error) {
	refSession, err := parseFromToken(cookie.Value)
	if err != nil {
		return nil, "", fmt.Errorf("Invalid auth token")
	}
	currUser, err := findUserSessions(refSession.UserID, client)
	if err != nil {
		return nil, "", err
	}
	//find session
	currSession := currUser.deleteSession(refSession.SessionID)
	if currSession == nil {
		return nil, "", fmt.Errorf("Session not found")
	}

	switch currSession.VerifyRefresh(cookie.Value) {
	case true:
		tok := sess.GenerateTokens(currUser.ID)
		currUser.addSession(sess)

		if err := users.UpdateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return nil, "", err
		}
		return tok, currUser.Username, nil
	default:
		if err := users.UpdateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return nil, "", err
		}
		return nil, "", fmt.Errorf("Verification failed")
	}
}

func findUserSessions(uid string, client *mongo.Client) (*userSessions, error) {
	//find user
	currUser := new(userSessions)
	if err := users.LookupUser(client, bson.M{"_id": uid}, currUser); err != nil {
		return nil, fmt.Errorf("Invalid auth token")
	}
	if currUser.ID == "" {
		return nil, fmt.Errorf("Invalid auth token")
	}
	return currUser, nil
}

//Logout deketes current session
func Logout(client *mongo.Client, accSession *users.AccessSession) error {
	currUser, err := findUserSessions(accSession.UserID, client)
	if err != nil {
		return err
	}
	//find session
	currSession := currUser.deleteSession(accSession.SessionID)
	if currSession == nil {
		return fmt.Errorf("Session not found")
	}

	switch currSession.VerifyAccess(accSession.AccessToken) {
	case true:
		if err := users.UpdateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return err
		}
		return nil
	default:
		if err := users.UpdateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return err
		}
		return fmt.Errorf("Verification failed")
	}
}

//LogoutAll stops all user sessions
func LogoutAll(client *mongo.Client, accSession *users.AccessSession) error {
	currUser, err := findUserSessions(accSession.UserID, client)
	if err != nil {
		return err
	}
	//find session
	currSession := currUser.deleteSession(accSession.SessionID)
	if currSession == nil {
		return fmt.Errorf("Session not found")
	}
	//if user auth failed delete only active session
	switch currSession.VerifyAccess(accSession.AccessToken) {
	case true:
		if err := users.UpdateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": []users.Session{}}}); err != nil {
			return err
		}
		return nil
	default:
		if err := users.UpdateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return err
		}
		return fmt.Errorf("Verification failed")
	}
}

//ResetInfo contains user pasword reset information
type ResetInfo struct {
	Email       string
	RestorePass string
	RestoreKey  string
	ExpiresAt   int64
}

//ResetPass creates new password for user and sends email
func ResetPass(client *mongo.Client, form *users.SubmitForm) (*ResetInfo, error) {
	info, err := createResetInfo()
	if err != nil {
		return nil, fmt.Errorf("Cannot create a new password")
	}

	if err = setResetSession(client, form, info); err != nil {
		return nil, err
	}
	info.Email = form.Email
	return info, nil
}

func createResetInfo() (*ResetInfo, error) {
	obj := new(ResetInfo)
	var err error
	//pass
	obj.RestorePass, err = password.Generate(8, 4, 0, true, false)
	if err != nil {
		return nil, err
	}
	//key
	obj.RestoreKey = base64.URLEncoding.EncodeToString([]byte(uuid.New().String()))
	//exp
	obj.ExpiresAt = time.Now().Add(time.Second * 3600).Unix()
	return obj, nil
}

func setResetSession(client *mongo.Client, form *users.SubmitForm, info *ResetInfo) error {
	usersColl := client.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	res, err := usersColl.UpdateOne(
		ctx,
		bson.M{"email": form.Email},
		bson.M{"$set": bson.M{
			"rpass": encodeString(info.RestorePass),
			"rkey":  info.RestoreKey,
			"rexp":  info.ExpiresAt,
		}},
	)
	if err != nil {
		return err
	}
	if res.ModifiedCount < 1 {
		return fmt.Errorf("Email not found")
	}
	return nil
}

func encodeString(str string) string {
	h := sha256.Sum256([]byte(str))
	return base64.StdEncoding.EncodeToString(h[:])
}

type userConfirmSession struct {
	ID       string `bson:"_id,omitempty"`
	Username string `bson:"username,omitempty"`

	RestorePassword string `bson:"rpass,omitempty"`
	RestoreExpireAt int64  `bson:"rexp,omitempty"`
}

//ConfirmRestorePass creates new password for user and sends email
func ConfirmRestorePass(client *mongo.Client, restoreKey string) (string, error) {
	currUser := new(userConfirmSession)
	if err := users.LookupUser(client, bson.M{"rkey": restoreKey}, currUser); err != nil {
		return "", fmt.Errorf("Password reset failed")
	}

	switch currUser.RestoreExpireAt < time.Now().Unix() {
	case true:
		if err := users.UpdateUser(client, currUser.ID,
			bson.M{"$set": bson.M{"rpass": "", "rkey": "", "rexp": ""}}); err != nil {
			return "", err
		}
		return "", fmt.Errorf("Expired")
	default:
		if err := users.UpdateUser(client, currUser.ID,
			bson.M{"$set": bson.M{"password": currUser.RestorePassword, "rpass": "", "rkey": "", "rexp": ""}}); err != nil {
			return "", err
		}
	}
	return currUser.ID, nil
}
