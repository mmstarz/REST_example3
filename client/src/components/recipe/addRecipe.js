import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { Mutation } from "react-apollo";
import Spinner from "../loader/spinner";
import {
  ADD_RECIPE,
  GET_ALL_RECIPES,
  GET_USER_RECIPES
} from "../../queries/index";
import withAuth from "../Auth/withAuth";
// import CKEditor from "react-ckeditor-component";

const addRecipe = props => {
  const [isInvalid, setInvalid] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [inputs, setInputs] = useState({
    name: "",
    imageUrl: "",
    category: "init",
    description: "",
    instructions: "",
    creator: props.session.getCurrentUser
  });
  // const username = props.session.getCurrentUser.username;
  const {
    name,
    imageUrl,
    category,
    description,
    instructions,
    creator
  } = inputs;

  useEffect(() => {
    // console.log(props.session.getCurrentUser);
    if (
      !name ||
      category === "init" ||
      !description ||
      !instructions ||
      !imageUrl
    ) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
    // console.log(inputs.instructions);
  }, [inputs]);

  // const handleEditorChange = event => {
  //   const content = event.editor.getData();
  //   setInputs({
  //     ...inputs,
  //     instructions: content
  //   });
  // };

  const handleError = error => {
    setError(error.message);
  };

  const handleClear = async () => {
    // event.pereventDefault();
    setInputs({
      ...inputs,
      name: "",
      imageUrl: "",
      category: "init",
      description: "",
      instructions: ""
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event, addRecipe) => {
    await event.preventDefault();
    try {
      // await signupUser();
      await addRecipe();
      // console.log(data.addRecipe);
      // const token = response.data.signupUser.token;
      // await localStorage.setItem("token", token);
      // await props.refetch();
      await setError(null);
      await setSuccess("Registered Successfully");
      await setInputs({
        ...inputs,
        name: "",
        imageUrl: "",
        category: "init",
        description: "",
        instructions: ""
      });
      props.history.push("/something");
    } catch (err) {
      // console.log(err.message);
      await setSuccess(null);
      const error = err.message.split(":")[1];
      await setError(error);
    }
  };

  // !important cache update
  const handleCacheUpdate = async (cache, data) => {
    const { getRecipes } = await cache.readQuery({
      query: GET_ALL_RECIPES      
    });
    const { recipes, total } = getRecipes;
    // console.log(recipes, total);
    const {
      data: { addRecipe }
    } = data;

    const updateRecipe = {
      ...addRecipe,
      creator: {
        ...creator,
        email: props.session.getCurrentUser.email,
        username: props.session.getCurrentUser.username
      }
    };

    // manually reWrite cache of GET_ALL_RECIPES query
    await cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getRecipes: {
          ...getRecipes,
          recipes: [updateRecipe, ...recipes],
          total: total
        }
      }
    });
  };

  return (
    <div className="addRecipe">
      <h2>Add Recipe</h2>
      {error ? (
        <div className="error_message">
          <p>{error}</p>
        </div>
      ) : null}
      {success ? (
        <div className="success_message">
          <p>{success}</p>
        </div>
      ) : null}
      <Mutation
        mutation={ADD_RECIPE}
        variables={{
          name,
          imageUrl,
          category,
          description,
          instructions
        }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { _id: creator._id } },
          { query: GET_ALL_RECIPES }
        ]}
        update={handleCacheUpdate}
      >
        {(addRecipe, { data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return handleError(error);
          return (
            <form
              className="form"
              onSubmit={async event => await handleSubmit(event, addRecipe)}
            >
              <input
                type="text"
                name="name"
                placeholder="Recipe Name"
                value={name}
                onChange={event =>
                  setInputs({
                    ...inputs,
                    name: event.target.value
                  })
                }
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="image Url"
                value={imageUrl}
                onChange={event =>
                  setInputs({
                    ...inputs,
                    imageUrl: event.target.value
                  })
                }
              />
              <select
                name="category"
                placeholder="Category"
                value={category}
                onChange={event =>
                  setInputs({
                    ...inputs,
                    category: event.target.value
                  })
                }
              >
                <option value="init" disabled hidden>
                  Choose category
                </option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
              </select>
              <textarea
                // cols="10"
                rows="4"
                name="description"
                placeholder="Description"
                value={description}
                onChange={event =>
                  setInputs({
                    ...inputs,
                    description: event.target.value
                  })
                }
              />
              {/* <div className="instructions">
                <label htmlFor="instructions">Add instructions</label>
                <CKEditor
                  name="instructions"
                  content={instructions}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setInputs({ ...inputs, instructions: data});
                  }}
                  events={{
                    change: setInputs({
                      ...inputs,
                      instructions: event.editor.getData()
                    })
                  }} 
                />
              </div> */}
              <textarea
                // cols="10"
                rows="8"
                name="instructions"
                placeholder="Instructions"
                value={instructions}
                onChange={event =>
                  setInputs({
                    ...inputs,
                    instructions: event.target.value
                  })
                }
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="button-cancel"
                  onClick={handleClear}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={
                    isInvalid ? "button-primary-disabled" : "button-primary"
                  }
                  disabled={loading || isInvalid}
                >
                  Submit
                </button>
              </div>
            </form>
          );
        }}
      </Mutation>
    </div>
  );
};

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(addRecipe)
);
