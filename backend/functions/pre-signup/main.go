package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"

	"github.com/aws/aws-lambda-go/events"
)

func handler(ctx context.Context, event events.CognitoEventUserPoolsPreSignup) (events.CognitoEventUserPoolsPreSignup, error) {
	fmt.Println("confirming user", event.Request.UserAttributes)
	event.Response.AutoConfirmUser = true
	return event, nil
}

func main() {
	lambda.Start(handler)
}
