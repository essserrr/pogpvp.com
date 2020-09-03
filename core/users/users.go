package users

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"

	appl "Solutions/pvpSimulator/core/sim/app"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

//RegForm user registration form
type SubmitForm struct {
	Username      string
	Email         string
	Password      string
	CheckPassword string
	Token         string
	NewPassword   string
}

//VerifyRegForm verifies registartion form. Returns error if it is invalid
func (lf *SubmitForm) VerifyRegForm(ip string) error {
	var (
		wg         sync.WaitGroup
		capthcaErr error
	)
	//check capthca
	wg.Add(1)
	go func() {
		if err := lf.verifyCaptcha(ip); err != nil {
			capthcaErr = fmt.Errorf("Invalid captcha")
		}
		wg.Done()
	}()
	//username
	if err := checkLength(lf.Username, "Username", 4, 16); err != nil {
		return err
	}
	if !checkRegexp(lf.Username) {
		return fmt.Errorf("Wrong username format")
	}
	//email
	if err := checkLength(lf.Email, "Email", 0, 320); err != nil {
		return err
	}
	if !checkEmailRegexp(lf.Email) {
		return fmt.Errorf("Wrong email format")
	}
	//password
	if err := checkLength(lf.Password, "Password", 6, 20); err != nil {
		return err
	}
	if !checkRegexp(lf.Password) {
		return fmt.Errorf("Wrong password format")
	}
	//confirmation password
	if err := checkLength(lf.CheckPassword, "Confirmation password", 6, 20); err != nil {
		return err
	}
	if !checkRegexp(lf.CheckPassword) {
		return fmt.Errorf("Wrong confirmation password format")
	}
	//passwords equality
	if lf.CheckPassword != lf.Password {
		return fmt.Errorf("Passwords don't match")
	}
	wg.Wait()
	if capthcaErr != nil {
		return capthcaErr
	}
	return nil
}

//VerifyChPassForm verifies change password form. Returns error if it is invalid
func (lf *SubmitForm) VerifyChPassForm() error {
	//password
	if err := checkLength(lf.Password, "Password", 6, 20); err != nil {
		return err
	}
	if !checkRegexp(lf.Password) {
		return fmt.Errorf("Wrong password format")
	}
	//confirmation password
	if err := checkLength(lf.CheckPassword, "Confirmation password", 6, 20); err != nil {
		return err
	}
	if !checkRegexp(lf.CheckPassword) {
		return fmt.Errorf("Wrong confirmation password format")
	}
	//passwords equality
	if lf.CheckPassword != lf.NewPassword {
		return fmt.Errorf("Passwords don't match")
	}
	//New password
	if err := checkLength(lf.NewPassword, "New password", 6, 20); err != nil {
		return err
	}
	if !checkRegexp(lf.NewPassword) {
		return fmt.Errorf("Wrong new password password format")
	}
	return nil
}

//VerifyLogForm verifies login form. Returns error if it is invalid
func (lf *SubmitForm) VerifyLogForm(ip string) error {
	var (
		wg         sync.WaitGroup
		capthcaErr error
	)
	//check capthca
	wg.Add(1)
	go func() {
		if err := lf.verifyCaptcha(ip); err != nil {
			capthcaErr = fmt.Errorf("Invalid captcha")
		}
		wg.Done()
	}()
	//username
	if err := checkLength(lf.Username, "Username", 4, 16); err != nil {
		return err
	}
	if !checkRegexp(lf.Username) {
		return fmt.Errorf("Wrong username format")
	}
	//password
	if err := checkLength(lf.Password, "Password", 6, 20); err != nil {
		return err
	}
	if !checkRegexp(lf.Password) {
		return fmt.Errorf("Wrong password format")
	}
	wg.Wait()
	if capthcaErr != nil {
		return capthcaErr
	}
	return nil
}

//VerifyResetForm verifies restore password form. Returns error if it is invalid
func (lf *SubmitForm) VerifyResetForm(ip string) error {
	var (
		wg         sync.WaitGroup
		capthcaErr error
	)
	//check capthca
	wg.Add(1)
	go func() {
		if err := lf.verifyCaptcha(ip); err != nil {
			capthcaErr = fmt.Errorf("Invalid captcha")
		}
		wg.Done()
	}()
	//email
	if err := checkLength(lf.Email, "Email", 0, 320); err != nil {
		return err
	}
	if !checkEmailRegexp(lf.Email) {
		return fmt.Errorf("Wrong email format")
	}
	wg.Wait()
	if capthcaErr != nil {
		return capthcaErr
	}
	return nil
}

func checkLength(str, strType string, minLen, maxLen int) error {
	if str == "" {
		return fmt.Errorf("%v is reqired", strType)
	}
	if len(str) < minLen {
		return fmt.Errorf("%v must be longer than %v", strType, minLen)
	}
	if len(str) > maxLen {
		return fmt.Errorf("%v must be less than or equal %v", strType, maxLen)
	}
	return nil
}

func checkEmailRegexp(target string) bool {
	const reg = `^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`
	return regexp.MustCompile(reg).MatchString(target)
}

func checkRegexp(target string) bool {
	return regexp.MustCompile(`^([A-Za-z0-9@_\\-\\.!$%^&*+=]*)$`).MatchString(target)
}

//CaptchaResp google recaptcha verification response
type CaptchaResp struct {
	Success bool
	Error   []string `json:"error-codes"`
}

func (lf *SubmitForm) verifyCaptcha(ip string) error {
	captcha := new(CaptchaResp)
	if err := downloadAsObj(
		"https://www.google.com/recaptcha/api/siteverify?secret="+os.Getenv("SECRET_CAPTCHA")+"&response="+lf.Token+"&remoteip="+ip, &captcha); err != nil {
		return err
	}
	if len(captcha.Error) > 0 {
		return fmt.Errorf(strings.Join(captcha.Error, ", "))
	}
	return nil
}

func downloadAsObj(url string, target interface{}) error {
	response, err := http.Get(url)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	pageInBytes, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return err
	}

	err = json.Unmarshal(pageInBytes, &target)
	if err != nil {
		return err
	}
	return nil
}

//Encode encodes form
func (lf *SubmitForm) Encode(additionalEncoding bool) {
	h := sha256.Sum256([]byte(lf.Password))
	lf.Password = base64.StdEncoding.EncodeToString(h[:])

	if additionalEncoding {
		nph := sha256.Sum256([]byte(lf.NewPassword))
		lf.NewPassword = base64.StdEncoding.EncodeToString(nph[:])
	}
}

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

	Moves       map[string]appl.MoveBaseEntry `bson:"umoves,omitempty"`
	PokemonList UserPokemonList               `bson:"upokemonlist,omitempty"`

	Broker SetBrokerRequest `bson:"ubroker,omitempty"`
}

//UserPokemonList contains user pokemon
type UserPokemonList struct {
	Pokemon []UserPokemon            `bson:"upokemon,omitempty"`
	Parties map[string][]UserPokemon `bson:"uparties,omitempty"`
}

//UserPokemon contains user pokemon entry
type UserPokemon struct {
	Name     string
	IsShadow string

	QuickMove   string
	ChargeMove  string
	ChargeMove2 string

	Lvl float32
	CP  uint32

	Atk uint16
	Def uint16
	Sta uint16
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

//GenerateTokens Starts new session and generates new token pair
func (s *Session) GenerateTokens(id string) *Tokens {
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

//FilteredBrokerRequest contains filter options
type FilteredBrokerRequest struct {
	Country  string
	Region   string
	City     string
	Contacts string

	Have       PokDesires
	HaveCustom bool
	Want       PokDesires
	WantCustom bool
}

func (fbr *FilteredBrokerRequest) Limit() {
	haveLen := len(fbr.Have)
	if haveLen > 400 {
		delta := haveLen - 400
		for key := range fbr.Have {
			if delta < 1 {
				break
			}
			delete(fbr.Have, key)
			delta--
		}
	}
	wantLen := len(fbr.Want)
	if wantLen > 400 {
		delta := wantLen - 400
		for key := range fbr.Want {
			if delta < 1 {
				break
			}
			delete(fbr.Want, key)
			delta--
		}
	}
}

//PokDesires contains pokemon deasires of an user
type PokDesires map[string]BrokerPokemon

//MakeSearchPipline creates broker search pipe line
func (fbr *FilteredBrokerRequest) MakeSearchPipline() (*mongo.Pipeline, error) {
	//country is a required field
	if fbr.Country == "" {
		return nil, fmt.Errorf("You need to specify country")
	}
	//match trainers stage
	matchFormStage := bson.D{{"$match", bson.D(fbr.matchForm())}}
	//match create project stage
	project := bson.D{{"$project", bson.D(fbr.makePokemonProject())}}
	return &mongo.Pipeline{matchFormStage, project}, nil
}

func (fbr *FilteredBrokerRequest) matchForm() []bson.E {
	formQuery := make([]bson.E, 0, 6)
	formQuery = append(formQuery,
		bson.E{"ubroker.country", fbr.Country},
		etypeQueryIfExists("ubroker.region", fbr.Region),
		etypeQueryIfExists("ubroker.city", fbr.City),
		etypeQueryIfExists("ubroker.cont", fbr.Contacts))

	formQuery = append(formQuery, fbr.Have.makeMatchPokFilter("ubroker.want")...)
	formQuery = append(formQuery, fbr.Want.makeMatchPokFilter("ubroker.have")...)

	return formQuery
}

func etypeQueryIfExists(queryKey, queryValue string) bson.E {
	//if value is no "" match this value, otherwise check if field exists
	switch queryValue {
	case "":
		return bson.E{queryKey, bson.M{"$exists": true}}

	default:
		return bson.E{queryKey, queryValue}
	}
}

func (pd *PokDesires) makeMatchPokFilter(queryKey string) []bson.E {
	pokemonQuery := make([]bson.E, 0, 1)
	//if map is not set or is empty check if field exists
	if pd == nil || len(*pd) == 0 {
		pokemonQuery = append(pokemonQuery, bson.E{queryKey, bson.M{"$exists": true}})
		return pokemonQuery
	}
	//otherwise create "or" query
	orQuery := make([]interface{}, 0, 1)
	for key, value := range *pd {
		orQuery = append(orQuery, bson.D{{queryKey + "." + key + ".name", value.Name}})
	}
	pokemonQuery = append(pokemonQuery, bson.E{"$or", orQuery})
	return pokemonQuery
}

func (fbr *FilteredBrokerRequest) makePokemonProject() []bson.E {
	var pokemonQuery = make([]bson.E, 0, 4)
	pokemonQuery = append(pokemonQuery,
		bson.E{"username", 1},
		bson.E{"ubroker.country", 1},
		bson.E{"ubroker.region", 1},
		bson.E{"ubroker.city", 1},
		bson.E{"ubroker.cont", 1})

	pokemonQuery = append(pokemonQuery, fbr.Have.makeProjectPokFilter("ubroker.want")...)
	pokemonQuery = append(pokemonQuery, fbr.Want.makeProjectPokFilter("ubroker.have")...)

	return pokemonQuery

}

func (pd *PokDesires) makeProjectPokFilter(queryKey string) []bson.E {
	var pokemonQuery = make([]bson.E, 0, 1)
	//if map is not set or is empty select the whole filed
	if pd == nil || len(*pd) == 0 {
		pokemonQuery = append(pokemonQuery, bson.E{queryKey, 1})
		return pokemonQuery
	}
	//otherwise select only desired fields
	for _, value := range *pd {
		pokemonQuery = append(pokemonQuery, bson.E{queryKey + "." + value.Name, 1})
	}
	return pokemonQuery
}

//SetBrokerRequest contains user location info and user's shynies
type SetBrokerRequest struct {
	Country  string                   `bson:"country,omitempty"`
	Region   string                   `bson:"region,omitempty"`
	City     string                   `bson:"city,omitempty"`
	Contacts string                   `bson:"cont,omitempty"`
	Have     map[string]BrokerPokemon `bson:"have,omitempty"`
	Want     map[string]BrokerPokemon `bson:"want,omitempty"`
}

func (sbr *SetBrokerRequest) Limit() {
	haveLen := len(sbr.Have)
	if haveLen > 400 {
		delta := haveLen - 400
		for key := range sbr.Have {
			if delta < 1 {
				break
			}
			delete(sbr.Have, key)
			delta--
		}
	}
	wantLen := len(sbr.Want)
	if wantLen > 400 {
		delta := wantLen - 400
		for key := range sbr.Want {
			if delta < 1 {
				break
			}
			delete(sbr.Want, key)
			delta--
		}
	}
}

//BrokerPokemon is a single user pokemon which is sent to broker
type BrokerPokemon struct {
	Name   string `bson:"name,omitempty"`
	Type   string `bson:"type,omitempty"`
	Amount string `bson:"amount,omitempty"`
}

//SetMovesRequest vontains user moves to set
type SetMovesRequest struct {
	Moves map[string]appl.MoveBaseEntry
}

//AccessSession contains data for access action
type AccessSession struct {
	AccessToken string
	UserID      string
	SessionID   string
}

type accessObj struct {
	ID       string  `bson:"_id,omitempty"`
	Sessions Session `bson:"session,omitempty"`
}

//GetAccess gets accesss to database or returns a error
func GetAccess(client *mongo.Client, accSession *AccessSession) error {
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

	switch obj[0].Sessions.VerifyAccess(accSession.AccessToken) {
	case true:
		return nil
	default:
		return fmt.Errorf("Verification failed")
	}
}

//VerifyAccess verifies access token
func (s *Session) VerifyAccess(token string) bool {
	if s.AccessToken != token {
		return false
	}
	if s.AccessExp < time.Now().Unix() {
		return false
	}
	return true
}

//VerifyRefresh verifies refresh token
func (s *Session) VerifyRefresh(token string) bool {
	if s.RefreshToken != token {
		return false
	}
	if s.RefreshExp < time.Now().Unix() {
		return false
	}
	return true
}

//LookupUser searches for an user by id
func LookupUser(client *mongo.Client, query bson.M, target interface{}) error {
	usersColl := client.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	filterCursor := usersColl.FindOne(ctx, query)
	if err := filterCursor.Decode(target); err != nil {
		return err
	}
	return nil
}

//FindMany searches for users specified bu given query
func FindMany(client *mongo.Client, query *mongo.Pipeline, target interface{}) error {
	usersColl := client.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	filterCursor, err := usersColl.Aggregate(ctx, *query)
	if err != nil {
		return fmt.Errorf("Invalid search query")
	}

	if err = filterCursor.All(ctx, target); err != nil {
		return fmt.Errorf("Invalid search query")
	}
	return nil
}

//UpdateUser updates user by id
func UpdateUser(client *mongo.Client, id string, query bson.M) error {
	usersColl := client.Database("pogpvp").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if _, err := usersColl.UpdateOne(ctx, bson.M{"_id": id}, query); err != nil {
		return err
	}
	return nil
}
