const {gql} = require('graphql-tag')
const Mongoose = require("../database/db")

module.exports = {
  mongoose: new Mongoose.model(
    "Land",
    new Mongoose.Schema({
      ownerId: {type: String, required: true},
      size: {type: Number, required: true},
      infrastructures: [String],
      documents: [String],
      address_street: {type: String, required: true},
      address_number: {type: Number, required: true},
      address_complementation: String,
      address_reference: String,
      address_district: {type: String, required: true},
      address_city: {type: String, required: true},
      address_zip: {type: String, required: true},
      value_sell: Number,
    }, {timestamps: true})
  ),
  typeDef: gql`
    type Land{
      id: ID!
      ownerId: ID!
      size: Float
      infrastructures: [String]
      documents: [String]
      address_street: String
      address_number: Int
      address_complementation: String
      address_reference: String
      address_district: String
      address_city: String
      address_zip: String
      value_sell: Float
      value_rentPercentage: Float
    }
  `,
  resolvers: {
    lands: () => {

    },
    landById: () => {

    }
  },
  mutations: {
    create: () => {

    },
    update: () => {

    },
    delete: () => {

    }
  }
}