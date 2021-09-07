/*
  setup
*/

require("dotenv").config()

const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
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
const typeDefs = require('./src/models/typeDefs.js')
const resolvers = require('./src/models/resolvers.js')
const context = ({ req, res  }) => {
  
}
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
  cookieParser(), 
  session(sessionOptions)
);
app.use('/graphql',graphqlExpress({schema}))
app.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}))



module.exports = app