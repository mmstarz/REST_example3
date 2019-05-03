import React, { useEffect, useState, useContext } from "react";
import ProfileContext from "../../hooks/context";
import { Mutation } from "react-apollo";
import { UPDATE_USER_RECIPE } from "../../queries/index";
import Spinner from '../loader/spinner';

const updateModal = ({ show, recipe }) => {
  const { state, dispatch } = useContext(ProfileContext);
  const { modal, currentRecipe } = state;
  const [inputs, setInputs] = useState({
    _id: currentRecipe._id,
    name: currentRecipe.name,
    imageUrl: currentRecipe.imageUrl,
    category: currentRecipe.category,
    description: currentRecipe.description,
    instructions: currentRecipe.instructions
  });

  const { _id, name, imageUrl, category, description, instructions } = inputs;

  useEffect(() => {
    // console.log(inputs);
  }, [inputs]);

  const handleSubmit = async (event, updateUserRecipe) => {
    event.preventDefault();
    await updateUserRecipe();   
    dispatch({ type: "CLOSE_MODAL" });
  }

  return (
    <Mutation
      mutation={UPDATE_USER_RECIPE}
      variables={{ _id, name, imageUrl, category, description, instructions }}
    >
      {(updateUserRecipe, {data, loading, error}) => {
        if(loading) return <Spinner />
        return (
          <div className={modal ? "modal modal-open" : "modal"}>
            <div className="modal-inner">
              <div className="modal-content">
                <form onSubmit={event => handleSubmit(event, updateUserRecipe)} className="modal-content-inner">
                  <div className='modal-header'>
                    <h4>Edit Recipe</h4>
                    <button className='modal-cancel'>X</button>
                  </div>                  
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
                  <div className="modal-buttons">
                    <button
                      type="button"
                      className="button-cancel"
                      onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="button-primary">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
      }}
    </Mutation>
  );
};

export default updateModal;
