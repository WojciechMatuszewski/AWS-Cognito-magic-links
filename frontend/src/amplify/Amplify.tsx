import React from "react";
import Auth from "@aws-amplify/auth";

export const amplifyConfig = {
  region: "eu-central-1",
  userPoolId: "eu-central-1_2j0vm84Fn",
  userPoolWebClientId: "7i81vto935fcedd3qh8mli9vq3",
  authenticationFlowType: "CUSTOM_AUTH",
};

Auth.configure(amplifyConfig);

type Props = {
  children: React.ReactNode;
};

function AmplifyProvider({ children }: Props) {
  return <div>{children}</div>;
}

export { AmplifyProvider };
