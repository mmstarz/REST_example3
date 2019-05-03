import {gql} from 'apollo-boost';

export const recipeFragments = {
    recipe: gql`
        fragment CompleteRecipe on Recipe {
            _id
            name
            category
            description
            instructions
            imageUrl
            likes
            creator {
                _id
                email
                username
            }
            createdAt
            updatedAt
        }
    `,
    likes: gql`
        fragment Likes on Recipe {
            _id
            likes
        }
    `    
}