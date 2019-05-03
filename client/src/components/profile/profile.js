import React, { useContext, useReducer } from "react";
import UserInfo from "./userInfo";
import UserRecipes from "./userRecipes";
import withAuth from "../Auth/withAuth";

import ProfileContext from "../../hooks/context";
import profileReducer from "../../hooks/reducer";

const profile = ({ session }) => {
  const initialState = useContext(ProfileContext);
  const [state, dispatch] = useReducer(profileReducer, initialState);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      <div className="profile">
        <div className="profile-main">
          <UserInfo session={session} />
          <UserRecipes session={session} />
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default withAuth(session => session && session.getCurrentUser)(profile);
