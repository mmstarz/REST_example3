const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Recipe = require("../models/Recipe");

const SECRET = process.env.JWT_SECRET;
// const ITEMS_PER_PAGE = +process.env.ITEMS;

const createToken = (user, secret, expiresIn) => {
  const { username, email, _id } = user;
  const token = jwt.sign({ _id, username, email }, secret, { expiresIn });
  return token;
};

// module.exports
exports.resolvers = {
  Query: {
    getUserRecipes: async (root, { _id }, { Recipe }) => {
      const recipes = await Recipe.find().populate({
        path: "creator",
        model: "User"
      });
      // console.log(recipes);
      const items = await recipes.filter(recipe => {
        return recipe.creator._id.toString() === _id.toString();
      });

      // items.forEach(element => {
      //   console.log(element.name);
      // });

      return items;
    },
    search: async (root, { term }, { Recipe }) => {
      if (term) {
        const searchItems = await Recipe.find().populate({
          path: "creator",
          model: "User"
        });

        // filter by field username need to add more fields
        const items = await searchItems.filter(item => {
          const {
            name,
            category,
            creator: { username }
          } = item;
          return (
            name.toLowerCase() === term.toLowerCase() ||
            category.toLowerCase() === term.toLowerCase() ||
            username.toLowerCase() === term.toLowerCase()
          );
        });
        // console.log(items);
        return items;
      }
    },
    getRecipes: async (root, args, { Recipe }) => {
      const total = await Recipe.find().count();
      const recipes = await Recipe.find()
        .sort({ updatedAt: "desc" })   
        .populate({ path: "creator", model: "User" });        

      // console.log('resolvers.js getRecipes: ' , recipes)
      // return recipes;
      return {
        recipes: recipes.map(item => {
          return {
            ...item._doc,
            _id: item._id.toString(),
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString()
          };
        }),
        total: total
      };
    },
    getRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOne({ _id: _id }).populate({
        path: "creator",
        model: "User"
      });
      return recipe;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({ email: currentUser.email }).populate({
        path: "favourites",
        model: "Recipe"
      });

      return user;
    }
  },
  Mutation: {
    addRecipe: async (
      root,
      { name, imageUrl, description, category, instructions },
      { currentUser, Recipe }
    ) => {
      // console.log(currentUser);
      const recipe = new Recipe({
        name: name,
        imageUrl: imageUrl,
        description: description,
        category: category,
        instructions: instructions,
        creator: currentUser._id
      });

      // console.log('addRecipe: ', recipe);

      const storedRecipe = await recipe.save();
      // return mongoDB document with all params
      // return { ...storedUser._doc, _id: storedUser._id.toString() };
      return { ...storedRecipe._doc, _id: storedRecipe._id.toString() };
    },
    likeRecipe: async (root, { _id, userId }, { Recipe, User }) => {
      // find recipe and increment field likes by 1
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        {
          $inc: { likes: 1 }
        }
      );
      // find user and add recipe id to the set of favourites ids
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: { favourites: _id }
        }
      );
      return recipe;
    },
    unLikeRecipe: async (root, { _id, userId }, { Recipe, User }) => {
      // find recipe and increment field likes by 1
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        {
          $inc: { likes: -1 }
        }
      );
      // await recipe.save()
      // find user and add recipe id to the set of favourites ids
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { favourites: _id }
        }
      );
      // await user.save();
      return recipe;
    },
    updateUserRecipe: async (
      root,
      { _id, name, imageUrl, category, description, instructions },
      { Recipe }
    ) => {
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id },
        { $set: { name, imageUrl, category, description, instructions } },
        { new: true }
      );

      return updatedRecipe;
    },
    deleteUserRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOneAndRemove({ _id: _id });
      return recipe;
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("Username already taken");
      }

      const storedEmail = await User.findOne({ email });
      if (storedEmail) {
        throw new Error("Email already taken");
      }

      const newUser = await new User({
        username: username,
        email: email,
        password: password
      }).save();

      return {
        token: createToken(newUser, SECRET, "1hr"),
        userId: newUser._id.toString()
      };
    },
    signinUser: async (root, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Email not registered");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Please enter valid password");
      }

      return {
        token: createToken(user, SECRET, "1hr"),
        userId: user._id.toString()
      };
    }
  }
};
