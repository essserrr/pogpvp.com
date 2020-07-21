package mongocalls

import (
	"context"
	"fmt"
	"time"

	users "Solutions/pvpSimulator/core/users"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

//Session contains user session info
type Session struct {
	AccessToken        string `bson:"aToken,omitempty"`
	RefreshToken       string `bson:"rToken,omitempty"`
	SessionID          string `bson:"sessId,omitempty"`
	SessionFingerprint string `bson:"sessFing,omitempty"`
}

//User contains user info
type User struct {
	ID       string    `bson:"_id,omitempty"`
	Username string    `bson:"username,omitempty"`
	Password string    `bson:"password,omitempty"`
	Email    string    `bson:"email,omitempty"`
	Sessions []Session `bson:"session,omitempty"`
}

//CheckUserExistance checks user existance
func CheckUserExistance(clent *mongo.Client, form *users.RegForm) error {
	usersColl := clent.Database("pogpvp").Collection("users")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	filterCursor, err := usersColl.Find(ctx, bson.M{
		"$or": []interface{}{
			bson.M{"password": form.Username},
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
		if val.Username == form.Username {
			str += "Username is already exists in database, choose another username"
		}
	}
	if len(users) > 1 {
		str += "; "
	}
	for _, val := range users {
		if val.Email == form.Email {
			str += "Email is already exists in database, choose another email"
		}
	}
	return str
}
