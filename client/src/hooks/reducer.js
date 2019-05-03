const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_MODAL": {
      // console.log(state);
      // console.log(action.payload);
      return {
        ...state,
        modal: true,
        currentRecipe: action.payload
      };
    }
    case "CLOSE_MODAL": {
      const currentRecipe = {
        _id: "",
        name: "",
        category: "init",
        description: "",
        instructions: "",
        imageUrl: "",
        likes: 0,
        creator: {
          _id: "",
          email: "",
          username: ""
        },
        createdAt: "",
        updatedAt: ""
      };
      return {
        ...state,
        modal: false,
        currentRecipe: currentRecipe
      };
    }
    default:
      return state;
  }
};

export default reducer;
