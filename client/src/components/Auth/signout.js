import React from "react";
import { ApolloConsumer } from "react-apollo";
import {withRouter} from 'react-router-dom';

const signout = props => {
  const handleLogout = async (client) => {    
    await localStorage.removeItem('token');
    await client.resetStore();
    props.history.push('/');
  };

  return (
    <ApolloConsumer>
      {client => {
        // console.log(client);
        return (
          <button
            type="button"
            className="button-logout"
            onClick={() => handleLogout(client)}
          >
            Logout
          </button>
        );
      }}
    </ApolloConsumer>
  );
};

export default withRouter(signout);
