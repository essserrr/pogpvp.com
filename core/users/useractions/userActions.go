package useractions

import (
	"fmt"

	appl "Solutions/pvpSimulator/core/sim/app"
	users "Solutions/pvpSimulator/core/users"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

const maxPokemon = 1500
const maxParties = 24
const maxMoves = 100

//UserInfo contains user's main info
type UserInfo struct {
	Username string
	Email    string
	RegAt    int64
}

//GetUserInfo returns users main info
func GetUserInfo(client *mongo.Client, accSession *users.AccessSession) (*UserInfo, error) {
	if err := users.GetAccess(client, accSession); err != nil {
		return nil, err
	}
	currUser := new(UserInfo)
	if err := users.LookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return nil, fmt.Errorf("Wrong auth token")
	}
	return currUser, nil
}

type userPass struct {
	Password string `bson:"password,omitempty"`
}

//ChPass changes user's password if creditinail are right
func ChPass(client *mongo.Client, form *users.SubmitForm, accSession *users.AccessSession) error {
	if err := users.GetAccess(client, accSession); err != nil {
		return err
	}
	currUser := new(userPass)
	if err := users.LookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return fmt.Errorf("Password change failed")
	}
	if currUser.Password != form.Password {
		return fmt.Errorf("Wrong old password")
	}
	if err := users.UpdateUser(client, accSession.UserID,
		bson.M{"$set": bson.M{"password": form.NewPassword}}); err != nil {
		return err
	}
	return nil
}

type sessionResponse struct {
	Sessions []UserSession `bson:"session,omitempty"`
}

//UserSession contains user session info
type UserSession struct {
	OS      string
	IP      string
	Browser string
}

//GetUserSessions returns user sessions info
func GetUserSessions(client *mongo.Client, accSession *users.AccessSession) (*[]UserSession, error) {
	if err := users.GetAccess(client, accSession); err != nil {
		return nil, err
	}

	currUser := new(sessionResponse)
	if err := users.LookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return nil, fmt.Errorf("Wrong auth token")
	}
	return &currUser.Sessions, nil
}

type movesResponse struct {
	Moves map[string]appl.MoveBaseEntry `bson:"umoves,omitempty"`
}

//GetUserMoves returns custom moves of a user
func GetUserMoves(client *mongo.Client, accSession *users.AccessSession) (*map[string]appl.MoveBaseEntry, error) {
	if err := users.GetAccess(client, accSession); err != nil {
		return nil, err
	}

	currUser := new(movesResponse)
	if err := users.LookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return nil, fmt.Errorf("Wrong auth token")
	}
	if currUser.Moves == nil {
		currUser.Moves = make(map[string]appl.MoveBaseEntry)
	}

	return &currUser.Moves, nil
}

//SetUserMoves sets custom moves of a user
func SetUserMoves(client *mongo.Client, req *users.SetMovesRequest, accSession *users.AccessSession) error {
	if err := users.GetAccess(client, accSession); err != nil {
		return err
	}
	if err := users.UpdateUser(client, accSession.UserID,
		bson.M{"$set": bson.M{"umoves": limitMovelist(req.Moves)}}); err != nil {
		return fmt.Errorf("Wrong auth token")
	}
	return nil
}

func limitMovelist(movelist map[string]appl.MoveBaseEntry) map[string]appl.MoveBaseEntry {
	if len(movelist) <= maxMoves {
		return movelist
	}
	newMovelist := make(map[string]appl.MoveBaseEntry)
	counter := 1
	for key, value := range movelist {
		if counter >= maxMoves {
			break
		}
		newMovelist[key] = value
		counter++
	}
	return newMovelist
}

//BrokerResponse contains broker of a single suer
type brokerResponse struct {
	Broker users.SetBrokerRequest `bson:"ubroker,omitempty"`
}

//SetUserBroker adds user's pokemon to broker
func SetUserBroker(client *mongo.Client, req *users.SetBrokerRequest, accSession *users.AccessSession) error {
	if err := users.GetAccess(client, accSession); err != nil {
		return err
	}
	if err := users.UpdateUser(client, accSession.UserID,
		bson.M{"$set": bson.M{"ubroker": req}}); err != nil {
		return fmt.Errorf("Wrong auth token")
	}
	return nil
}

//GetSelfBroker returns user broker info
func GetSelfBroker(client *mongo.Client, accSession *users.AccessSession) (*users.SetBrokerRequest, error) {
	if err := users.GetAccess(client, accSession); err != nil {
		return nil, err
	}
	currUser := new(brokerResponse)
	if err := users.LookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return nil, fmt.Errorf("Wrong auth token")
	}
	if currUser.Broker.Have == nil {
		currUser.Broker.Have = make(map[string]users.BrokerPokemon)
	}
	if currUser.Broker.Want == nil {
		currUser.Broker.Want = make(map[string]users.BrokerPokemon)
	}

	return &currUser.Broker, nil
}

//FilteredBrokersResponse contains broker of a single suer
type FilteredBrokersResponse struct {
	Username string                 `bson:"username,omitempty"`
	Broker   users.SetBrokerRequest `bson:"ubroker,omitempty"`
}

//GetFilteredBrokers returns filtered user FilteredBrokersResponse
func GetFilteredBrokers(client *mongo.Client, query *mongo.Pipeline) (*[]FilteredBrokersResponse, error) {
	var userBrokers []FilteredBrokersResponse
	if err := users.FindMany(client, query, &userBrokers); err != nil {
		return nil, fmt.Errorf("Invalid search query")
	}

	if userBrokers == nil || len(userBrokers) < 1 {
		return nil, fmt.Errorf("No such trainers")
	}
	return &userBrokers, nil
}

type collectionResponse struct {
	PokemonList users.UserPokemonList `bson:"upokemonlist,omitempty"`
}

//GetUserCollection returns custom pokemon of a user
func GetUserCollection(client *mongo.Client, accSession *users.AccessSession) (*users.UserPokemonList, error) {
	if err := users.GetAccess(client, accSession); err != nil {
		return nil, err
	}

	currUser := new(collectionResponse)
	if err := users.LookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return nil, fmt.Errorf("Wrong auth token")
	}
	if currUser.PokemonList.Parties == nil {
		currUser.PokemonList.Parties = make(map[string][]users.UserPokemon)
	}
	if currUser.PokemonList.Pokemon == nil {
		currUser.PokemonList.Parties = make(map[string][]users.UserPokemon)
	}

	return &currUser.PokemonList, nil
}

//SetUserCollection sets custom pokemon of a user
func SetUserCollection(client *mongo.Client, req *users.UserPokemonList, accSession *users.AccessSession) error {
	if err := users.GetAccess(client, accSession); err != nil {
		return err
	}
	if err := users.UpdateUser(client, accSession.UserID,
		bson.M{"$set": bson.M{"upokemonlist": limitPokemonlist(req)}}); err != nil {
		return fmt.Errorf("Wrong auth token")
	}
	return nil
}

func limitPokemonlist(req *users.UserPokemonList) users.UserPokemonList {
	if len(req.Pokemon) > maxPokemon {
		req.Pokemon = req.Pokemon[:maxPokemon]
	}

	if len(req.Parties) > maxParties {
		newMovelist := make(map[string][]users.UserPokemon)
		counter := 0
		for key, value := range req.Parties {
			if counter >= maxParties {
				break
			}
			newMovelist[key] = value

			counter++
		}
		req.Parties = newMovelist
	}

	for key, value := range req.Parties {
		if len(value) > 6 {
			req.Parties[key] = value[:6]
		}
	}

	return *req
}

type pokemonResponse struct {
	PokemonList pokemonCollection `bson:"upokemonlist,omitempty"`
}

type pokemonCollection struct {
	Pokemon []appl.UserPokemon `bson:"upokemon,omitempty"`
}

//GetUserPokemon returns custom pokemon of a user
func GetUserPokemon(client *mongo.Client, accSession *users.AccessSession) ([]appl.UserPokemon, error) {
	if err := users.GetAccess(client, accSession); err != nil {
		return nil, err
	}

	currUser := new(pokemonResponse)
	if err := users.LookupUser(client, bson.M{"_id": accSession.UserID}, currUser); err != nil {
		return nil, fmt.Errorf("Wrong auth token")
	}
	return currUser.PokemonList.Pokemon, nil
}
