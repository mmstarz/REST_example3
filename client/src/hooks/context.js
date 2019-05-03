import React from "react";

const ProfileContext = React.createContext({
  modal: false,
  currentRecipe: {
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
  }
});

export default ProfileContext;
