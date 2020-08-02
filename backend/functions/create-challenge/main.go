package main

import (
	"fmt"
	"net/url"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

func handler(event *events.CognitoEventUserPoolsCreateAuthChallenge) (*events.CognitoEventUserPoolsCreateAuthChallenge, error) {
	sender, found := os.LookupEnv("EMAIL_SENDER")
	if !found {
		panic(errors.New("EMAIL_SENDER environment variable not found"))
	}
	fmt.Println("creating challenge(name):", event.Request.ChallengeName, "for user with an email of:", event.Request.UserAttributes["email"])
	sess := session.Must(session.NewSession())
	awsSes := ses.New(sess)

	email, found := event.Request.UserAttributes["email"]
	if !found {
		return nil, errors.New("email not found")
	}
	event.Response.PublicChallengeParameters = map[string]string{"email": email}

	code := uuid.Must(uuid.NewRandom()).String()[:5]
	event.Response.PrivateChallengeParameters = map[string]string{"code": code}

	params := url.Values{}
	params.Add("code", code)
	params.Add("email", event.Request.UserAttributes["email"])
	u := url.URL{
		Scheme:   "http",
		Host:     "localhost:3000",
		Path:     "/verify",
		RawQuery: params.Encode(),
	}

	link := u.String()
	_, err := awsSes.SendEmail(&ses.SendEmailInput{
		ConfigurationSetName: nil,
		Destination: &ses.Destination{
			ToAddresses: aws.StringSlice([]string{email}),
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(fmt.Sprintf(`<html><body><h1>Your sign in link</h1><p>%v</p></body></html>`, link)),
				},
				Text: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(fmt.Sprintf("Your sign in link: %v", link)),
				},
			},
			Subject: &ses.Content{
				Charset: aws.String("UTF-8"),
				Data:    aws.String("Your sign in link"),
			},
		},
		Source: aws.String(sender),
	})
	if err != nil {
		fmt.Print("could not send the email")
		return event, err
	}

	return event, nil
}

func main() {
	lambda.Start(handler)
}
