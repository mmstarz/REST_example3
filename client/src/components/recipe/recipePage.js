import React from "react";
import { withRouter } from "react-router-dom";

import { Query } from "react-apollo";
import { GET_RECIPE } from "../../queries/index";

import Spinner from '../loader/spinner';
import LikeRecipe from "./likeRecipe";

const recipePage = ({ history, match, session }) => {
  const { _id } = match.params;
  const { getCurrentUser } = session;

  const formatDate = date => {
    const newDate = new Date(date).toLocaleDateString("en-GB");
    const newTime = new Date(date).toLocaleTimeString("en-GB");

    return `${newDate} at ${newTime}`;
  };

  return (
    <Query query={GET_RECIPE} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error)
          return (
            <div className="error_message">
              <p>{error.message}</p>
            </div>
          );
        const { getRecipe } = data;
        const {
          name,
          category,
          likes,
          description,
          instructions,
          creator,
          updatedAt,
          createdAt
        } = getRecipe;
        // console.log(data);
        return (
          <div className="recipe-page">
            <h2>Details</h2>
            <div className="recipe-page-main">
              <div className="recipe-social">
                <div
                  className="recipe-page-details"
                  style={{
                    background: `url(${
                      data.getRecipe.imageUrl
                    }) center center / cover no-repeat`
                  }}
                >
                  <p className='category'>{category}</p>
                </div>
                <div className="recipe-title">
                  <h3>{name}</h3>
                </div>
                <div className="recipe-info">
                  {getCurrentUser ? <LikeRecipe _id={_id} /> : null}
                  <span role='img' className='likes'>{likes}</span>
                  {/* <p className="likes">{likes}</p> */}
                </div>
              </div>
              <div className="recipe-details">
                <p>
                  <span className="recipe-details-fieldname">Description:</span>
                  {description}
                </p>
                <p>
                  <span className="recipe-details-fieldname">
                    Instructions:
                  </span>
                </p>
                <p dangerouslySetInnerHTML={{ __html: instructions}}></p>
                <p>
                  <span className="recipe-details-fieldname">Username:</span>
                  {creator.username}
                </p>
                <p>
                  <span className="recipe-details-fieldname">
                    Created Date:
                  </span>
                </p>
                <p>{formatDate(createdAt)}</p>
                <p>
                  <span className="recipe-details-fieldname">
                    Updated Date:
                  </span>
                </p>
                <p>{formatDate(updatedAt)}</p>
              </div>
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(recipePage);
