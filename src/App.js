import React from "react";
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <Dashboard></Dashboard>
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="*">
          <Error></Error>
        </Route>
      </Switch>
    </Router>
  );
}
//path=* always renders whaatever the /url is typed
//using switch renders the first child matching the /url entered
export default App;
