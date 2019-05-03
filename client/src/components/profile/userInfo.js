import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const userInfo = ({ session: { getCurrentUser } }) => {
  const { email, username, favourites, createdAt, updatedAt } = getCurrentUser;

  useEffect(() => {
    // console.log(getCurrentUser.favourites);
  }, []);

  const formatDate = date => {
    const newDate = new Date(date).toLocaleDateString('en-GB');
    const newTime = new Date(date).toLocaleTimeString('en-GB');

    return `${newDate} at ${newTime}`
  }

  return (
    <div className="user-info">
      <h2>User Profile</h2>
      <p>Email: {email}</p>
      <p>Username: {username}</p>
      <h3>Favourites:</h3>
      {favourites.length
        ? favourites.map(item => (
            <Link key={item._id} to={`/recipes/${item._id}`}>
              {item.name}
            </Link>
          ))
        : <p>You have no favourites currenty. Consider to add some.</p>}
      <p>Join date: {formatDate(createdAt)}</p>
      <p>Last update: {formatDate(updatedAt)}</p>
    </div>
  );
};

export default userInfo;
