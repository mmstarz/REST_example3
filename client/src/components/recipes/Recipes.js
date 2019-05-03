import React from "react";
import Recipe from "../recipe/Recipe";

const Recipes = props => {
  return (
    <ul className="recipes_list">
      {props.recipes.map(recipe => (
        <Recipe key={recipe._id} recipe={recipe} />
      ))}
    </ul>
  );
};

export default Recipes;
