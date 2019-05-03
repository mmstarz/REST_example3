const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// variables init
require("dotenv").config({ path: "variables.env" });
// mongoose schemas
const RecipeSchema = require("./models/Recipe");
const UserScehma = require("./models/User");
// apollo graphql express middleware
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
// graphQL
const { typeDefs } = require("./graphql/schema");
const { resolvers } = require("./graphql/resolvers");
const SECRET = process.env.JWT_SECRET;

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});

// mongodb+srv://username:password@react-0ftvn.gcp.mongodb.net/recipes?retryWrites=true
// connect ot datatbase
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("DB connected");
//   })
//   .catch(err => console.error(err));

// app init
const app = express();
// CORS error handling old style
// app.use((req, res, next) => {
//   // res.setHeader('Access-Control-Allow-Origin', 'codepen.io'); // for certain domain
//   // res.setHeader('Access-Control-Allow-Origin', 'name1, name2,...'); // for special domains
//   res.setHeader("Access-Control-Allow-Origin", "*"); // for any client access
//   // also need to setup list of methods to allow access
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE"
//   );
//   // setup header to access
//   res.setHeader('Access-Control-Allow-Headers', '*'); // for any headers
//   // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   // allow preflight
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });
// CORS Apollo style
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));
// JWT authentication
app.use(async (req, res, next) => {  
  const token = await req.headers["authorization"];
  if(!token) {
    req.currentUser = false;
    return next();
  }

  // console.log(token, typeof token);
  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, SECRET);
      // console.log(currentUser);
      req.currentUser = currentUser;
    } catch (err) {      
      // console.log(err);
      req.currentUser = false;
      return next();
    }
  }
  next();
});
// body parser middleware init
app.use(bodyParser.json());
// midwares
// app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// connect mongoose schemas with GraphQL
app.use(
  "/graphql",
  graphqlExpress(({ currentUser }) => ({
    schema: schema,
    context: {
      Recipe: RecipeSchema,
      User: UserScehma,
      currentUser: currentUser
    }
  }))
);

// deployment setting
if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// port listen
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error(err));
