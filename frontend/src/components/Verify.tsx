import React from "react";
import { useLocation, Redirect } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { amplifyConfig } from "../amplify/Amplify";
import { Text } from "@chakra-ui/core";

function createCognitoUser(email: string, session: string) {
  const pool = new CognitoUserPool({
    ClientId: amplifyConfig.userPoolWebClientId,
    UserPoolId: amplifyConfig.userPoolId,
  });

  const user = new CognitoUser({
    Pool: pool,
    Username: email,
  });
  (user as any).Session = session;

  return user;
}

function Verify() {
  const { search } = useLocation();

  const [state, setState] = React.useState<{
    loading: boolean;
    error: boolean;
  }>({ loading: true, error: false });

  React.useEffect(() => {
    const params = new URLSearchParams(search);

    const code = params.get("code");
    const email = params.get("email");
    const session = localStorage.getItem("session");

    async function verify() {
      if (!code || !email || !session) return;

      const user = createCognitoUser(email, session);
      try {
        await Auth.sendCustomChallengeAnswer(user, code);
        localStorage.removeItem("session");

        setState({ loading: false, error: false });
      } catch (e) {
        setState({ loading: false, error: true });
      }
    }

    verify();
  }, [search]);

  if (state.loading) return <Text>Verifying...</Text>;

  if (state.error) return <Text>an error occurred, please try again</Text>;

  return <Redirect to="secret" />;
}

export { Verify };
