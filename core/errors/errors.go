package errors

import (
	"encoding/json"
	"fmt"
)

//ClientError is an interface contining all kind of client errors
type ClientError interface {
	Error() string
	// ResponseBody returns response body.
	ResponseBody() ([]byte, error)
	// ResponseHeaders returns http status code and headers.
	ResponseHeaders() (int, map[string]string)
}

// HTTPError implements ClientError interface.
type HTTPError struct {
	Cause  error  `json:"case"`
	Detail string `json:"detail"`
	Status int    `json:"-"`
}

func (e *HTTPError) Error() string {
	switch true {
	case e.Cause == nil:
		return e.Detail
	default:
		return e.Cause.Error()
	}
}

// ResponseBody returns JSON response body.
func (e *HTTPError) ResponseBody() ([]byte, error) {
	body, err := json.Marshal(e)
	if err != nil {
		return nil, fmt.Errorf("Error while parsing error body: %v", err)
	}
	return body, nil
}

// ResponseHeaders returns http status code and headers.
func (e *HTTPError) ResponseHeaders() (int, map[string]string) {
	return e.Status, map[string]string{
		"Content-Type": "application/json; charset=utf-8",
	}
}

//NewHTTPError creates new HTTP error
func NewHTTPError(err error, status int, detail string) error {
	return &HTTPError{
		Cause:  err,
		Detail: detail,
		Status: status,
	}
}
