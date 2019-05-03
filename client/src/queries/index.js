import { gql } from "apollo-boost";
import {recipeFragments} from './fragments';

// queries
export const GET_ALL_RECIPES = gql`
    query {
        getRecipes {
            recipes {
                ...CompleteRecipe
            }
            total
        }
    }
    ${recipeFragments.recipe}
`;

export const SEARCH_RECIPES = gql`
    query($term: String) {
        search(term: $term) {
            ...CompleteRecipe
        }
    }
    ${recipeFragments.recipe}
`;

export const GET_RECIPE = gql`
    query($_id: ID!) {
        getRecipe(_id: $_id) {
            ...CompleteRecipe
        }
    }
    ${recipeFragments.recipe}
`;

export const GET_CURRENT_USER = gql`
    query {
        getCurrentUser {
            _id
            username
            email
            favourites {
                _id
                name
                likes
            }
            createdAt
            updatedAt
        }
    }
`;

export const GET_USER_RECIPES = gql`
    query($_id: ID!) {
        getUserRecipes(_id: $_id) {
            ...CompleteRecipe
        }
    }
    ${recipeFragments.recipe}
`;

// mutations
export const SIGNUP_USER = gql`
    mutation($username: String!, $email: String!, $password: String!) {
        signupUser(username: $username, email: $email, password: $password) {
            token
            userId
        }
    }
`;

export const SIGNIN_USER = gql`
    mutation($email: String!, $password: String!) {
        signinUser(email: $email, password: $password) {
            token
            userId
        }
    }
`;

export const ADD_RECIPE = gql`
    mutation($name: String!, $imageUrl: String!, $category: String!, $description: String!, $instructions: String!) {
        addRecipe(name: $name, imageUrl: $imageUrl, category: $category, description: $description,
            instructions: $instructions) {
                _id
                name
                imageUrl
                category
                description
                instructions
                likes
                creator {
                    _id
                }
                imageUrl                
                createdAt
                updatedAt 
            }
    }    
`;

export const LIKE_RECIPE = gql`
    mutation($_id: ID!, $userId: ID!) {
        likeRecipe(_id: $_id, userId: $userId) {
           ...Likes
        }
    }
    ${recipeFragments.likes}
`;

export const UNLIKE_RECIPE = gql`
    mutation($_id: ID!, $userId: ID!) {
        unLikeRecipe(_id: $_id, userId: $userId) {
           ...Likes
        }
    }
    ${recipeFragments.likes}
`;

export const UPDATE_USER_RECIPE = gql`
    mutation(
        $_id: ID!,
        $name: String!,
        $imageUrl: String!,
        $category: String!,
        $description: String!,
        $instructions: String!) {
            updateUserRecipe(
                _id: $_id,
                name: $name,
                imageUrl: $imageUrl,
                category: $category,
                description: $description,
                instructions: $instructions
                ) {
                    _id
                    name
                    imageUrl
                    category
                    description
                    instructions
                    likes
                    creator {
                        _id
                    }
                    imageUrl                
                    createdAt
                    updatedAt
        }
    }   
`;

export const DELETE_USER_RECIPE = gql`
    mutation($_id: ID!) {
        deleteUserRecipe(_id: $_id) {
            _id            
        }
    }
`;