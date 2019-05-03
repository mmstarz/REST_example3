import React, { useState, useEffect } from "react";
import "./App.css";

import { Query } from "react-apollo";
import { GET_ALL_RECIPES } from "../../queries/index";

import Recipe from "../recipe/recipe";
import Spinner from "../loader/spinner";

import posed from "react-pose";

const RecipeListItem = posed.li({
  show: { x: "0%", straggerChildren: 100 },
  hide: { x: "-100%" }
});

const ITEMS_PER_PAGE = 4;

// 0. pagination: totalItems > ITEMS_PER_PAGE
// 1. currPage: page,
// 2. hasNextPage: ITEMS_PER_PAGE * page < totalItems,
// 3. hasPrevPage: page > 1,
// 4. nextPage: page + 1,
// 5. prevPage: page - 1,
// 6. lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)

const App = props => {
  const [showList, setShowList] = useState(false);
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    // component did mount
    // console.log(currPage);
    toggleShow();
  }, [currPage]);

  const chunk = (array, size) => {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }
    return chunked_arr;
  }

  const toggleShow = () => {
    setShowList(true);
  };

  const handlePrev = () => {
    setCurrPage(currPage - 1);
    setShowList(false);
  };

  const handleNext = () => {
    setCurrPage(currPage + 1);
    setShowList(false);
  };

  return (
    <div className="app">
      <Query query={GET_ALL_RECIPES}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error: {error}</div>;
          const {
            getRecipes: { recipes, total }
          } = data;

          const hasNextPage = ITEMS_PER_PAGE * currPage < total;
          const hasPrevPage = currPage > 1;
          const nextPage = currPage + 1;
          const prevPage = currPage - 1;
          const lastPage = Math.ceil(total / ITEMS_PER_PAGE);         

          const currentRecipes = chunk(recipes, ITEMS_PER_PAGE);
          // console.log(currentRecipes[currPage - 1]);

          return (
            <div className="recipes">
              <h2>Please Enjoy</h2>
              <ul className="recipes_list">
                {currentRecipes[currPage - 1].map(recipe => (
                  <RecipeListItem
                    pose={showList ? "show" : "hide"}
                    key={recipe._id}
                    className="recipe-container"
                  >
                    <Recipe {...recipe} />
                  </RecipeListItem>
                ))}
              </ul>
              <div className="pagination">
                {currPage !== 1 && prevPage !== 1 ? (
                  <button className="page" onClick={() => setCurrPage(1)}>
                    1
                  </button>
                ) : null}
                {currPage !== 1 && prevPage !== 1 ? (
                  <div className="dots">
                    <span>...</span>
                  </div>
                ) : null}
                {hasPrevPage ? (
                  <button className="page" onClick={() => handlePrev()}>
                    {prevPage}
                  </button>
                ) : null}
                {hasNextPage || hasPrevPage ? (
                  <button className="currentPage">{currPage}</button>
                ) : null}
                {hasNextPage ? (
                  <button className="page" onClick={() => handleNext()}>
                    {nextPage}
                  </button>
                ) : null}
                {lastPage !== currPage && nextPage !== lastPage ? (
                  <div className="dots">
                    <span>...</span>
                  </div>
                ) : null}
                {lastPage !== currPage && nextPage !== lastPage ? (
                  <button
                    className="page"
                    onClick={() => {
                      setCurrPage(lastPage);
                    }}
                  >
                    {lastPage}
                  </button>
                ) : null}
              </div>
            </div>
          );
        }}
      </Query>
    </div>
  );
};

export default App;
