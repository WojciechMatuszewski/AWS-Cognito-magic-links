import React from "react";
import Auth from "@aws-amplify/auth";

function useIsAuthenticated() {
  const [state, setState] = React.useState<{
    loading: boolean;
    authenticated: boolean;
  }>({ loading: true, authenticated: false });

  React.useEffect(() => {
    async function getUserInfo() {
      try {
        await Auth.currentSession();
        setState({ loading: false, authenticated: true });
      } catch (e) {
        setState({ loading: false, authenticated: false });
      }
    }

    getUserInfo();
  }, []);

  return state;
}

export { useIsAuthenticated };
