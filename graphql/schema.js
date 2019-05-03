exports.typeDefs = `

    type Recipe {
        _id: ID!
        name: String!
        category: String!
        description: String!
        instructions: String!
        imageUrl: String!
        likes: Int        
        creator: User
        createdAt: String
        updatedAt: String
    }

    type User {
        _id: ID!
        username: String!
        password: String!
        email: String!        
        favourites: [Recipe]
        createdAt: String
        updatedAt: String
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type RecipesData {
        recipes: [Recipe],
        total: Int
    }
        
    type Query {
        getRecipes: RecipesData
        getCurrentUser: User
        getUserRecipes(_id: ID!): [Recipe]
        getRecipe(_id: ID! ): Recipe!
        search(term: String): [Recipe]
    }    

    type Mutation {        
        addRecipe(name: String!, imageUrl: String!, description: String!, category: String!,
            instructions: String! ): Recipe!
        updateUserRecipe(_id: ID!, name: String!, imageUrl: String!, description: String!, category: String!,
            instructions: String!): Recipe
        deleteUserRecipe(_id: ID!): Recipe        
        likeRecipe(_id: ID!, userId: ID!): Recipe!
        unLikeRecipe(_id: ID!, userId: ID!): Recipe!
        signupUser(username: String!, email: String!, password: String!): AuthData!
        signinUser(email: String!, password: String!): AuthData!        
    }   
    
`;
