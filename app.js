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

/*
  applying middlewares
*/
app.use(
  cors(), 
  bodyParser.json(), 
  session(sessionOptions)
)

app.use('/graphql', graphqlHTTP(request => ({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: {
      request,
      username: null
    }
})))



module.exports = app