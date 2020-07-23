package users

import (
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
)

//RegForm user registration form
type RegForm struct {
	Username      string
	Email         string
	Password      string
	Fingerprint   string
	CheckPassword string
	Token         string
}

//CaptchaResp google recaptcha verification response
type CaptchaResp struct {
	Success bool
	Error   []string `json:"error-codes"`
}

//VerifyRegForm verifies registartion form. Returns error if it is invalid
func (lf *RegForm) VerifyRegForm(ip string) error {
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
	if lf.Fingerprint == "" {
		return fmt.Errorf("Invalid form")
	}
	//username
	if err := checkLength(lf.Username, "Username", 6, 16); err != nil {
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
	//password equality
	if lf.CheckPassword != lf.Password {
		return fmt.Errorf("Passwords don't match")
	}
	wg.Wait()
	if capthcaErr != nil {
		return capthcaErr
	}
	return nil
}

func checkLength(str, strType string, minLen, maxLen int) error {
	if str == "" {
		return fmt.Errorf("%v is reqired", str)
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

func (lf *RegForm) verifyCaptcha(ip string) error {
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
	pageInBytes, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return err
	}
	response.Body.Close()

	err = json.Unmarshal(pageInBytes, &target)
	if err != nil {
		return err
	}
	return nil
}

//Encode encodes form
func (lf *RegForm) Encode() {
	h := sha256.Sum256([]byte(lf.Password))
	lf.Password = base64.StdEncoding.EncodeToString(h[:])
}

//VerifyLogForm verifies login form. Returns error if it is invalid
func (lf *RegForm) VerifyLogForm(ip string) error {
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
	if lf.Fingerprint == "" {
		return fmt.Errorf("Invalid form")
	}
	//username
	if err := checkLength(lf.Username, "Username", 6, 16); err != nil {
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
