import React from "react";
import { Query } from "react-apollo";
import { GET_CURRENT_USER } from "../../queries/index";
import Spinner from '../loader/spinner';

// High order component
const isAuth = Component => props => {
  return (
    <Query query={GET_CURRENT_USER}>
      {({ data, loading, refetch, error }) => {
        if (loading) return <Spinner />;
        // console.log(data);
        return <Component {...props} refetch={refetch} session={data} />;
      }}
    </Query>
  );
};

export default isAuth;
