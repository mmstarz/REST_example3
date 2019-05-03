import React from "react";
import { Link } from "react-router-dom";

import posed from 'react-pose';

const RecipeDiv = posed.div({
  show: {opacity: 1},
  hide: {opacity: 0.2}
})

const recipe = ({ _id, imageUrl, name, category, likes }) => {
  return (
    <RecipeDiv
      style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}
      className="recipes_list_item"
    >
      <div className="recipe-image-container">
        <img alt={_id} hidden />
      </div>
      <div className="recipe-actions">
        <Link to={`/recipes/${_id}`}>Info</Link>
      </div>
    </RecipeDiv>
  );
};

export default recipe;
