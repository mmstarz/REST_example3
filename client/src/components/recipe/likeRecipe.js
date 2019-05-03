import React, { useState, useEffect } from "react";
import isAuth from "../Auth/isAuth";
import { Mutation } from "react-apollo";
import {
  LIKE_RECIPE,
  GET_RECIPE,
  UNLIKE_RECIPE,
  GET_CURRENT_USER
} from "../../queries/index";

const likeRecipe = props => {
  const [liked, setLiked] = useState(false);
  const { getCurrentUser } = props.session;
  const { _id } = props;

  useEffect(() => {
    const isLiked = getCurrentUser.favourites.findIndex(
      item => item._id === _id
    );
    // console.log(isLiked);
    if (isLiked >= 0) {
      setLiked(true);
    }
    // console.log(liked);
  }, []);

  const handleUpdateUnLike = (cache, data) => {
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    });
    // console.log(data);
    const {
      data: { unLikeRecipe }
    } = data;
    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: {
          ...getRecipe,
          likes: unLikeRecipe.likes - 1
        }
      }
    });
  };

  const handleUpdateLike = (cache, { data: { likeRecipe } }) => {
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    });

    // console.log(getRecipe);
    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: {
          ...getRecipe,
          likes: likeRecipe.likes + 1
        }
      }
    });
  };

  const handleLike = async likeRecipe => {
    setLiked(true);
    // console.log("handleLike(liked): ", liked);
    await likeRecipe();
  };

  const handleUnLike = async unLikeRecipe => {
    setLiked(false);
    // console.log("handleUnLike(liked): ", liked);
    await unLikeRecipe();
  };

  return liked ? (
    <Mutation
      mutation={UNLIKE_RECIPE}
      variables={{ _id: _id, userId: getCurrentUser._id }}
      refetchQueries={() => [
        // { query: GET_RECIPE, variables: { _id } },
        { query: GET_CURRENT_USER }
      ]}
      update={handleUpdateUnLike}
    >
      {unLikeRecipe => {
        return (
          <button
            className="button-unlike"
            onClick={() => handleUnLike(unLikeRecipe)}
          >-1</button>
        );
      }}
    </Mutation>
  ) : (
    <Mutation
      mutation={LIKE_RECIPE}
      refetchQueries={() => [
        // { query: GET_RECIPE, variables: { _id } },
        { query: GET_CURRENT_USER }
      ]}
      variables={{ _id: _id, userId: getCurrentUser._id }}
      update={handleUpdateLike}
    >
      {likeRecipe => {
        return (
          <button className="button-like" onClick={() => handleLike(likeRecipe)} >+1</button>
        );
      }}
    </Mutation>
  );
};

export default isAuth(likeRecipe);
