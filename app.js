const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const client = require('./src/database/db')

const app = express();

const typeDefs = require('./src/models/typeDefs.js')
const resolvers = require('./src/models/resolvers.js')

const {makeExecutableSchema} = require('graphql-tools')
const schema = makeExecutableSchema({typeDefs, resolvers})

app.use(cors(), bodyParser.json());

const  {graphiqlExpress,graphqlExpress} = require('apollo-server-express')
app.use('/graphql',graphqlExpress({schema}))
app.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}))

module.exports = app
