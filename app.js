/*
  setup
*/

require("dotenv").config()

const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express');
const session = require("express-session")
const sessionOptions = {
  secret: 'keyboard cat',
  cookie: {
    secure: process.env.PROD
  },
  resave: false,
  saveUninitialized: false
}


/*
  init app
*/
const app = express();


/*
  setup Graphql
*/
const typeDefs = require('./src/typeDefs.js')
const resolvers = require('./src/resolvers.js')

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(typeDefs)

// const loggingMiddleware = (req, res, next) => {
//     next()
// }

/*
  applying middlewares
*/
app.use(
  cors(), 
  bodyParser.json(), 
  session(sessionOptions)
  // loggingMiddleware
)

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true
}))



module.exports = app