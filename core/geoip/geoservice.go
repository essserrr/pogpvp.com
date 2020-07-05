package geoip

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

//GeoIP stores whois info.
type GeoIP struct {
	IP          string  `json:"ip"`
	CountryCode string  `json:"country_code"`
	CountryName string  `json:"country_name"`
	RegionCode  string  `json:"region_code"`
	RegionName  string  `json:"region_name"`
	City        string  `json:"city"`
	Zipcode     string  `json:"zip"`
	Latitude    float32 `json:"latitude"`
	Longitude   float32 `json:"longitude"`
}

//GetCode gets geocode by IP
func GetCode(address string) (string, error) {
	response, err := http.Get("http://api.ipstack.com/" + address + "?access_key=c4476318972993f43c17546dbce57cee&format=1")
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	var geo GeoIP
	if err = json.Unmarshal(body, &geo); err != nil {
		return "", err
	}

	return geo.CountryCode, nil
}
