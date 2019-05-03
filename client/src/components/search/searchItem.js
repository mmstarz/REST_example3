import React from "react";
import { Link } from "react-router-dom";

const searchItem = (props) => {
  return (
    <Link to={`/recipes/${props._id}`}>
      <div className="search-result-info">
        <p>Title: {props.name}</p>
        <p>Likes: {props.likes}</p>
      </div>
    </Link>
  );
};

export default searchItem;
