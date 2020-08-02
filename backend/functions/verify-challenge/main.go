package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/pkg/errors"

	"github.com/aws/aws-lambda-go/events"
)

func handler(event *events.CognitoEventUserPoolsVerifyAuthChallenge) (*events.CognitoEventUserPoolsVerifyAuthChallenge, error) {
	fmt.Println("verifying challenge", event.Request.PrivateChallengeParameters, event.Request.ChallengeAnswer)

	expected, found := event.Request.PrivateChallengeParameters["code"]
	if !found {
		return nil, errors.Errorf("the code from private challenge params is empty %v", event.Request.PrivateChallengeParameters)
	}

	event.Response.AnswerCorrect = false
	if event.Request.ChallengeAnswer == expected {
		event.Response.AnswerCorrect = true
	}
	return event, nil
}

func main() {
	lambda.Start(handler)
}
