import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { SignIn } from "./components/SignIn";
import { Verify } from "./components/Verify";
import { Secret } from "./components/Secret";
import { SignUp } from "./components/SignUp";
import { useIsAuthenticated } from "./hooks/useIsAuthenticated";
import { Navigation } from "./components/Navigation";

function ProtectedRoute(props: React.ComponentProps<typeof Route>) {
  const { loading, authenticated } = useIsAuthenticated();

  if (loading) return <p>loading...</p>;

  if (authenticated) return <Route {...props} />;

  return <Redirect to="/sign-in" />;
}

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Navigation />
        <Switch>
          <Route path="/sign-in">
            <SignIn />
          </Route>
          <Route path="/sign-up">
            <SignUp />
          </Route>
          <ProtectedRoute path="/secret">
            <Secret />
          </ProtectedRoute>
          <Route path="/verify">
            <Verify />
          </Route>
          <Route path="*">
            <Redirect to="/sign-in" />
          </Route>
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

// function App() {
//   async function onSignUp() {
//     try {
//       await Auth.signUp({
//         attributes: { name: "wojtek3@wojtek.pk" },
//         clientMetadata: {},
//         password: "dupa1234",
//         username: "wojtek3@wojtek.pk",
//         validationData: [],
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   async function onSignIn() {
//     try {
//       await Auth.signIn({
//         password: "dupa1234",
//         username: "wojtek3@wojtek.pk",
//         validationData: {},
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   async function signOut() {
//     try {
//       await Auth.signOut({ global: true });
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   React.useEffect(() => {
//     const cleanup = Hub.listen("auth", (data) => {
//       console.log(data.payload);
//     });
//
//     return () => cleanup();
//   }, []);
//
//   React.useEffect(() => {
//     async function getUserData() {
//       try {
//         const result = await Auth.currentUserInfo();
//         console.log(result);
//       } catch (e) {
//         console.log(e);
//       }
//     }
//
//     getUserData();
//   }, []);
//
//   return (
//     <div>
//       <button onClick={onSignUp}>Sign up</button>
//       <br />
//       <button onClick={onSignIn}>Sign in</button>
//       <br />
//       <button onClick={signOut}>Logout</button>
//     </div>
//   );
// }

export { App };
