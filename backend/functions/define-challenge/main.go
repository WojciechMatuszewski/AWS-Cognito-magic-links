package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(event *events.CognitoEventUserPoolsDefineAuthChallenge) (*events.CognitoEventUserPoolsDefineAuthChallenge, error) {
	fmt.Println("defining challenge", event.Request.Session, event.Request.UserAttributes)

	req := event.Request
	if req.Session == nil || len(req.Session) == 0 {
		fmt.Print("presenting challenge")
		event.Response.IssueTokens = false
		event.Response.FailAuthentication = false
		event.Response.ChallengeName = "CUSTOM_CHALLENGE"

		return event, nil
	}

	challenge := req.Session[0]
	if challenge.ChallengeResult == false {
		fmt.Print("challenge result false")
		event.Response.FailAuthentication = true
		event.Response.IssueTokens = false

		return event, nil
	}

	fmt.Print("challenge ok, issuing tokens")
	event.Response.IssueTokens = true
	event.Response.FailAuthentication = false

	return event, nil
}

func main() {
	lambda.Start(handler)
}
