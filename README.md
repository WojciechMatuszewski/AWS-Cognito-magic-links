# Cognito magic links

This is an example how you might create a magic link feature using `AWS Cognito`.

The premise is simple, you have to register, then on each login you type your email.
`AWS Cognito` with `Lambda` hooks handle the rest.

# To run

You will need to create `.env` file with `EMAIL_SENDER` variable.

Since the emails are send through `SES` you will probably need to confirm it before using the app.

Deploying is done using `npm`

```bash
npm run deploy
```
