require('dot-env').config

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const client = require('./src/database/db')

const port = process.env.PORT || 9000;
const app = express();

const fs = require('fs')

const typeDefs = require('./src/models/typeDefs.js')
const resolvers = require('./src/models/resolvers.js')

const {makeExecutableSchema} = require('graphql-tools')
const schema = makeExecutableSchema({typeDefs, resolvers})

app.use(cors(), bodyParser.json());

const  {graphiqlExpress,graphqlExpress} = require('apollo-server-express')
app.use('/graphql',graphqlExpress({schema}))
app.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}))

const init = async() => {
   try{ 
      await client.connect()
      app.listen(
         port, () => console.info(
            `Server started on port ${port}`
         )
      )
   } catch(err){ 
      console.log(err)
   } finally{
      await client.close()
   }
}

init()