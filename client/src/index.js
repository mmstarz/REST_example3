import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./index.css";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Navigation from "./components/navigation/navigation";
import App from "./components/App/App";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Search from './components/search/search';
import AddRecipe from './components/recipe/addRecipe';
import RecipePage from './components/recipe/recipePage';
import Profile from './components/profile/profile';
import * as serviceWorker from "./serviceWorker";
import isAuth from "./components/Auth/isAuth";


// https://recipes-apollo.herokuapp.com/graphql
// http://localhost:4444/graphql

const client = new ApolloClient({
  uri: "https://recipes-apollo.herokuapp.com/graphql",
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("token");
    // console.log(token);
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log("Network Error", networkError);
      localStorage.removeItem('token');
      // clear token
      if (networkError.statusCode === 401) {
        localStorage.removeItem("token");
      }
    }
  }
});

const Root = ({ refetch, session }) => (
  <Router>
    <Fragment>
      <Navigation session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route path='/search' component={Search} />
        <Route path='/recipe/add' render={() => <AddRecipe session={session} />} />
        <Route path='/recipes/:_id' render={() => <RecipePage session={session} /> } />
        <Route path='/profile' render={()=> <Profile session={session} /> } />
        <Redirect to="/" />
      </Switch>
    </Fragment>
  </Router>
);

const Authenticated = isAuth(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Authenticated />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
