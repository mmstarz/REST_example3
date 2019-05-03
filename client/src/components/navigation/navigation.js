import React, { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import Signout from "../Auth/signout";

const UnAuth = () => {
  const [menu, setMenu] = useState(false);

  return (
    <Fragment>
      <ul className="main-navigation">
        <li className="main-navigation-item">
          <NavLink to="/" exact>
            Home
          </NavLink>
        </li>
        <li className="main-navigation-item">
          <NavLink to="/search">Search</NavLink>
        </li>
        <li className="main-navigation-item">
          <NavLink to="/signin">Login</NavLink>
        </li>
        <li className="main-navigation-item">
          <NavLink to="/signup">SignUp</NavLink>
        </li>
      </ul>
      <div className="mobile-navigation">
        <div
          className="mobile-navigation-menu-btn"
          onClick={() => setMenu(!menu)}
        >
          <div className="mobile-btn-el" />
          <div className="mobile-btn-el" />
          <div className="mobile-btn-el" />
        </div>
      </div>
      {menu ? (
        <div className="backdrop" onClick={() => setMenu(!menu)} />
      ) : null}
      {menu ? (
        <div className="mobile-menu">
          <NavLink to="/" exact>
            Home
          </NavLink>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/signin">Login</NavLink>
          <NavLink to="/signup">SignUp</NavLink>
        </div>
      ) : null}
    </Fragment>
  );
};

const Auth = ({ session }) => {
  const [menu, setMenu ] = useState(false);

  return (
    <Fragment>
      <ul className="main-navigation">
        <li className="main-navigation-item">
          <NavLink to="/" exact>
            Home
          </NavLink>
        </li>
        <li className="main-navigation-item">
          <NavLink to="/search">Search</NavLink>
        </li>
        <li className="main-navigation-item">
          <NavLink to="/recipe/add">Add Recipe</NavLink>
        </li>
        <li className="main-navigation-item">
          <NavLink to="/profile">Profile</NavLink>
        </li>
      </ul>
      <div className="mobile-navigation">
        <div
          className="mobile-navigation-menu-btn"
          onClick={() => setMenu(!menu)}
        >
          <div className="mobile-btn-el" />
          <div className="mobile-btn-el" />
          <div className="mobile-btn-el" />
        </div>
      </div>
      {menu ? (
        <div className="backdrop" onClick={() => setMenu(!menu)} />
      ) : null}
      {menu ? (
        <div className="mobile-menu">
          <NavLink to="/" exact>
            Home
          </NavLink>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/recipe/add">Add Recipe</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </div>
      ) : null}
      <div className="greet">
        <h2>
          Welcome, <strong>{session.getCurrentUser.username}</strong> {":)"}
        </h2>
        <Signout />
      </div>
    </Fragment>
  );
};

const navigation = ({ session }) => {
  return (
    <nav>
      {session && session.getCurrentUser ? (
        <Auth session={session} />
      ) : (
        <UnAuth />
      )}
    </nav>
  );
};

export default navigation;
