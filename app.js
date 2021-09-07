/*
  setup
*/

require("dotenv").config()

const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express');
const session = require("express-session")
const  {graphiqlExpress,graphqlExpress} = require('apollo-server-express')
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
const context = async ({ req, res }) => ({ req, res })
const {makeExecutableSchema} = require('graphql-tools')
const schema = makeExecutableSchema({
  typeDefs, 
  resolvers,
  context
})


/*
  applying middlewares
*/
app.use(
  cors(), 
  bodyParser.json(), 
  session(sessionOptions)
);
app.use('/graphql',graphqlExpress({schema}))
app.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}))



module.exports = app