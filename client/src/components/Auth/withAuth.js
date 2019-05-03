import React from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";
import { GET_CURRENT_USER } from "../../queries/index";
import Spinner from '../loader/loader'; 

const withAuth = conditionFunc => Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({ data, loading, error }) => {
      if (loading) return <Spinner />;

      return conditionFunc(data) ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      );
    }}
  </Query>
);

export default withAuth;
