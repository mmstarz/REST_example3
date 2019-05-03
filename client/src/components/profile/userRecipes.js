import React, { useEffect, useContext } from "react";
import { Query, Mutation } from "react-apollo";
import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER
} from "../../queries/index";
import Spinner from "../loader/spinner";
import UpdateModal from "./updateModal";
import { Link } from "react-router-dom";
import ProfileContext from "../../hooks/context";

const userRecipes = ({ session: { getCurrentUser } }) => {
  const { state, dispatch } = useContext(ProfileContext);
  // const [modal, setModal] = useState(false);
  // const [currentRecipe, setCurrentRecipe] = useState({
  //   name: "",
  //   imageUrl: "",
  //   category: "init",
  //   description: "",
  //   instructions: "",
  //   creator: {}
  // });

  const { modal } = state;

  useEffect(() => {
    // console.log(state);
    // console.log(modal);
    // console.log(current._id);
  }, []);
  // console.log(getCurrentUser)
  const { _id } = getCurrentUser;
  // console.log(_id);
  const handleDelete = async deleteUserRecipe => {
    const confirmation = window.confirm(
      "Are ou sure, you want to delete this recipe?"
    );
    if (confirmation) {
      await deleteUserRecipe();
      // console.log(result.data.deleteUserRecipe);
    }
  };

  return (
    <Query query={GET_USER_RECIPES} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        const { getUserRecipes } = data;
        // console.log(getUserRecipes);
        return (
          <div className="userRecipes">
            <h2>User Recipes</h2>
            {modal ? <UpdateModal /> : null}
            <div className="user-result">
              {!getUserRecipes.length ? (
                <div>
                  <p>You have no published recipes</p>
                </div>
              ) : null}
              {getUserRecipes.map(recipe => (
                <div key={recipe._id} className="user-result-info">
                  <Link to={`/recipes/${recipe._id}`}>
                    <p className="user-result-info-p">Title: {recipe.name}</p>
                    <p className="user-result-info-p">Likes: {recipe.likes}</p>
                  </Link>
                  <p
                    className="settings"
                    onClick={() =>
                      dispatch({ type: "OPEN_MODAL", payload: recipe })
                    }
                  />
                  <Mutation
                    mutation={DELETE_USER_RECIPE}
                    variables={{ _id: recipe._id }}
                    refetchQueries={() => [
                      { query: GET_ALL_RECIPES },
                      { query: GET_CURRENT_USER }
                    ]}
                    update={(cache, { data: { deleteUserRecipe } }) => {
                      const { getUserRecipes } = cache.readQuery({
                        query: GET_USER_RECIPES,
                        variables: { _id }
                      });

                      cache.writeQuery({
                        query: GET_USER_RECIPES,
                        variables: { _id },
                        data: {
                          getUserRecipes: getUserRecipes.filter(
                            recipe => recipe._id !== deleteUserRecipe._id
                          )
                        }
                      });
                    }}
                  >
                    {(
                      deleteUserRecipe,
                      { data, loading, error },
                      attrs = {}
                    ) => {
                      if (loading) return <Spinner />;
                      return (
                        <p
                          className="delete"
                          onClick={() => handleDelete(deleteUserRecipe)}
                        >
                          {attrs.loading ? <Spinner /> : ""}
                        </p>
                      );
                    }}
                  </Mutation>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default userRecipes;
