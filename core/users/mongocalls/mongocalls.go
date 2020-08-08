package mongocalls

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"os"
	"time"

	appl "Solutions/pvpSimulator/core/sim/app"
	users "Solutions/pvpSimulator/core/users"

	"github.com/sethvargo/go-password/password"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

//User contains user info
type User struct {
	ID       string    `bson:"_id,omitempty"`
	Username string    `bson:"username,omitempty"`
	Password string    `bson:"password,omitempty"`
	Email    string    `bson:"email,omitempty"`
	RegAt    int64     `bson:"regat,omitempty"`
	Sessions []Session `bson:"session,omitempty"`

	RestorePassword string `bson:"rpass,omitempty"`
	RestoreKey      string `bson:"rkey,omitempty"`
	RestoreExpireAt int64  `bson:"rexp,omitempty"`

	Moves map[string]appl.MoveBaseEntry `bson:"umoves,omitempty"`
}

//Session contains user session info
type Session struct {
	SessionID string `bson:"sessId,omitempty"`

	AccessToken string `bson:"aToken,omitempty"`
	AccessExp   int64  `bson:"aExp,omitempty"`

	RefreshToken string `bson:"rToken,omitempty"`
	RefreshExp   int64  `bson:"rExp,omitempty"`

	Browser string `bson:"browser,omitempty"`
	Os      string `bson:"os,omitempty"`
	IP      string `bson:"ip,omitempty"`
}

//UsernameEmail username and email
type UsernameEmail struct {
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
	var users []UsernameEmail
	if err = filterCursor.All(ctx, &users); err != nil {
		return err
	}
	if len(users) > 0 {
		return fmt.Errorf(makeErrString(&users, form))
	}
	return nil
}

func makeErrString(users *[]UsernameEmail, form *users.SubmitForm) string {
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
	_, err := usersColl.InsertOne(ctx, User{
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
func NewSession(client *mongo.Client, sess Session, id string) (*Tokens, error) {
	tok := sess.generateTokens(id)
	if err := updateUser(client, id, bson.M{"$set": bson.M{"session": []Session{sess}}}); err != nil {
		return nil, err
	}
	return tok, nil
}

//Tokens contains access and refresh tokens
type Tokens struct {
	UserID    string
	SessionID string

	AToken SingleToken
	RToken SingleToken
}

//SingleToken contains single token information
type SingleToken struct {
	Token   string
	Expires int64
}

func (s *Session) generateTokens(id string) *Tokens {
	tok := new(Tokens)
	tok.startTokenSession(id)
	s.AccessToken = tok.AToken.Token
	s.RefreshToken = tok.RToken.Token
	s.SessionID = tok.SessionID
	s.AccessExp = tok.AToken.Expires
	s.RefreshExp = tok.RToken.Expires
	return tok
}

func (t *Tokens) startTokenSession(uid string) error {
	t.UserID = uid
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

//UserSessions contains user sessions info
type UserSessions struct {
	ID       string    `bson:"_id,omitempty"`
	Username string    `bson:"username,omitempty"`
	Sessions []Session `bson:"session,omitempty"`
}

func (u *UserSessions) addSession(sess Session) {
	if u.Sessions == nil {
		u.Sessions = make([]Session, 0, 1)
	}
	if len(u.Sessions) >= 5 {
		u.Sessions = u.Sessions[1:5]
	}
	u.Sessions = append(u.Sessions, sess)
}

//deleteSession deletes session from array and return deleted session
func (u *UserSessions) findSession(sid string) *Session {
	if u.Sessions == nil {
		return nil
	}
	for _, value := range u.Sessions {
		if value.SessionID == sid {
			return &value
		}
	}
	return nil
}

//deleteSession deletes session from array and return deleted session
func (u *UserSessions) deleteSession(sid string) *Session {
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
func Signin(client *mongo.Client, form *users.SubmitForm, sess Session) (*Tokens, error) {
	currUser := new(UserSessions)
	if err := lookupUser(client, bson.M{"username": form.Username, "password": form.Password}, currUser); err != nil {
		return nil, fmt.Errorf("Incorrect username and / or password")
	}
	if currUser.ID == "" {
		return nil, fmt.Errorf("Incorrect username and / or password")
	}
	tok := sess.generateTokens(currUser.ID)
	currUser.addSession(sess)

	if err := updateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
		return nil, err
	}
	return tok, nil
}

func lookupUser(client *mongo.Client, query bson.M, target interface{}) error {
	usersColl := client.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	filterCursor := usersColl.FindOne(ctx, query)
	if err := filterCursor.Decode(target); err != nil {
		return err
	}
	return nil
}

func updateUser(client *mongo.Client, id string, query bson.M) error {
	usersColl := client.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if _, err := usersColl.UpdateOne(ctx, bson.M{"_id": id}, query); err != nil {
		return err
	}
	return nil
}

//Refresh refreshes user session if creditinails are right
func Refresh(client *mongo.Client, sess Session, refSession *RefreshSession) (*Tokens, string, error) {
	currUser, err := findUserSessions(refSession.UserID, client)
	if err != nil {
		return nil, "", err
	}
	//find session
	currSession := currUser.deleteSession(refSession.SessionID)
	if currSession == nil {
		return nil, "", fmt.Errorf("Session not found")
	}

	switch currSession.verifyRefresh(refSession.RefreshToken) {
	case true:
		tok := sess.generateTokens(currUser.ID)
		currUser.addSession(sess)

		if err := updateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return nil, "", err
		}
		return tok, currUser.Username, nil
	default:
		if err := updateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return nil, "", err
		}
		return nil, "", fmt.Errorf("Verification failed")
	}
}

func findUserSessions(uid string, client *mongo.Client) (*UserSessions, error) {
	//find user
	currUser := new(UserSessions)
	if err := lookupUser(client, bson.M{"_id": uid}, currUser); err != nil {
		return nil, fmt.Errorf("Invalid auth token")
	}
	if currUser.ID == "" {
		return nil, fmt.Errorf("Invalid auth token")
	}
	return currUser, nil
}

type AccessSession struct {
	AccessToken string
	UserID      string
	SessionID   string
}

type RefreshSession struct {
	RefreshToken string
	UserID       string
	SessionID    string
}

//Logout deketes current session
func Logout(client *mongo.Client, accSession *AccessSession) error {
	currUser, err := findUserSessions(accSession.UserID, client)
	if err != nil {
		return err
	}
	//find session
	currSession := currUser.deleteSession(accSession.SessionID)
	if currSession == nil {
		return fmt.Errorf("Session not found")
	}

	switch currSession.verifyAccess(accSession.AccessToken) {
	case true:
		if err := updateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return err
		}
		return nil
	default:
		if err := updateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return err
		}
		return fmt.Errorf("Verification failed")
	}
}

func (s *Session) verifyRefresh(token string) bool {
	if s.RefreshToken != token {
		return false
	}
	if s.RefreshExp < time.Now().Unix() {
		return false
	}
	return true
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

//LogoutAll stops all user sessions
func LogoutAll(client *mongo.Client, accSession *AccessSession) error {
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
	switch currSession.verifyAccess(accSession.AccessToken) {
	case true:
		if err := updateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": []Session{}}}); err != nil {
			return err
		}
		return nil
	default:
		if err := updateUser(client, currUser.ID, bson.M{"$set": bson.M{"session": currUser.Sessions}}); err != nil {
			return err
		}
		return fmt.Errorf("Verification failed")
	}
}

type userPass struct {
	Password string `bson:"password,omitempty"`
}

//ChPass changes user's password if creditinail are right
func ChPass(client *mongo.Client, form *users.SubmitForm, accSession *AccessSession) error {
	if err := getAccess(client, accSession); err != nil {
		return err
	}
	currUser := new(userPass)
	if err := lookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return fmt.Errorf("Password change failed")
	}
	if currUser.Password != form.Password {
		return fmt.Errorf("Wrong old password")
	}
	if err := updateUser(client, accSession.UserID,
		bson.M{"$set": bson.M{"password": form.NewPassword}}); err != nil {
		return err
	}
	return nil
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
	if err := lookupUser(client, bson.M{"rkey": restoreKey}, currUser); err != nil {
		return "", fmt.Errorf("Password reset failed")
	}

	switch currUser.RestoreExpireAt < time.Now().Unix() {
	case true:
		if err := updateUser(client, currUser.ID,
			bson.M{"$set": bson.M{"rpass": "", "rkey": "", "rexp": ""}}); err != nil {
			return "", err
		}
		return "", fmt.Errorf("Expired")
	default:
		if err := updateUser(client, currUser.ID,
			bson.M{"$set": bson.M{"password": currUser.RestorePassword, "rpass": "", "rkey": "", "rexp": ""}}); err != nil {
			return "", err
		}
	}
	return currUser.ID, nil
}

//GetUserInfo returns users main info
func GetUserInfo(client *mongo.Client, accSession *AccessSession) (*users.UserInfo, error) {
	if err := getAccess(client, accSession); err != nil {
		return nil, err
	}
	currUser := new(users.UserInfo)
	if err := lookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return nil, fmt.Errorf("Wrong auth token")
	}
	return currUser, nil
}

type movesResponse struct {
	Moves map[string]appl.MoveBaseEntry `bson:"umoves,omitempty"`
}

//GetUserMoves returns custom moves of a user
func GetUserMoves(client *mongo.Client, accSession *AccessSession) (*map[string]appl.MoveBaseEntry, error) {
	if err := getAccess(client, accSession); err != nil {
		return nil, err
	}

	currUser := new(movesResponse)
	if err := lookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return nil, fmt.Errorf("Wrong auth token")
	}
	return &currUser.Moves, nil
}

type MovesRequest struct {
	Moves map[string]appl.MoveBaseEntry
}

//SetUserMoves sets custom moves of a user
func SetUserMoves(client *mongo.Client, req *MovesRequest, accSession *AccessSession) error {
	if err := getAccess(client, accSession); err != nil {
		return err
	}
	if err := updateUser(client, accSession.UserID,
		bson.M{"$set": bson.M{"umoves": limitMovelist(req.Moves)}}); err != nil {
		return fmt.Errorf("Wrong auth token")
	}
	return nil
}

func limitMovelist(movelist map[string]appl.MoveBaseEntry) map[string]appl.MoveBaseEntry {
	if len(movelist) <= 50 {
		return movelist
	}
	newMovelist := make(map[string]appl.MoveBaseEntry)
	counter := 0
	for key, value := range movelist {
		if counter > 50 {
			break
		}
		newMovelist[key] = value
		counter++
	}
	return newMovelist
}

type sessionResponse struct {
	Sessions []users.UserSession `bson:"session,omitempty"`
}

//GetUserSessions returns users sessions info
func GetUserSessions(client *mongo.Client, accSession *AccessSession) (*[]users.UserSession, error) {
	if err := getAccess(client, accSession); err != nil {
		return nil, err
	}

	currUser := new(sessionResponse)
	if err := lookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return nil, fmt.Errorf("Wrong auth token")
	}
	return &currUser.Sessions, nil
}

type idObject struct {
	uid string
	sid string
}

func parseFromToken(token string) (*idObject, error) {
	jwt, err := decodeToken(token)
	if err != nil {
		return nil, fmt.Errorf("Invalid token format")
	}
	ids := new(idObject)
	var ok bool
	//check uid
	ids.uid, ok = (*jwt)["u_id"].(string)
	if !ok {
		return nil, fmt.Errorf("Invalid token format")
	}
	//check session
	ids.sid, ok = (*jwt)["s_id"].(string)
	if !ok {
		return nil, fmt.Errorf("Invalid token format")
	}
	return ids, nil
}

type accessObj struct {
	ID       string  `bson:"_id,omitempty"`
	Sessions Session `bson:"session,omitempty"`
}

func getAccess(client *mongo.Client, accSession *AccessSession) error {
	//find user
	usersColl := client.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	matchStage1 := bson.D{{"$match", bson.D{{"_id", accSession.UserID}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$session"}, {"preserveNullAndEmptyArrays", false}}}}
	matchStage2 := bson.D{{"$match", bson.D{{"session.sessId", accSession.SessionID}}}}
	project := bson.D{{"$project", bson.D{{"session", 1}}}}

	sessionCursor, err := usersColl.Aggregate(ctx, mongo.Pipeline{matchStage1, unwindStage, matchStage2, project})
	if err != nil {
		return fmt.Errorf("Invalid auth token")
	}

	obj := []accessObj{}
	if err = sessionCursor.All(ctx, &obj); err != nil {
		return fmt.Errorf("Invalid auth token")
	}
	if len(obj) != 1 {
		return fmt.Errorf("Invalid auth token")
	}

	switch obj[0].Sessions.verifyAccess(accSession.AccessToken) {
	case true:
		return nil
	default:
		return fmt.Errorf("Verification failed")
	}
}

func (s *Session) verifyAccess(token string) bool {
	if s.AccessToken != token {
		return false
	}
	if s.AccessExp < time.Now().Unix() {
		return false
	}
	return true
}
