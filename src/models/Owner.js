const {gql} = require('graphql-tag')
const Mongoose = require("../database/db")

module.exports = {

  mongoose: new Mongoose.model(
    "Owner",
    new Mongoose.Schema({
      name: {type: String, required: true},
      phone: {type: String, required: true, unique:true},
      username: {type: String, required: true, unique: true},
      cellphone: {type: String, required: true, unique: true},
      documents: [String],
      properties: [String],
      lands: [String],
      address_street: {type: String, required: true},
      address_number: {type: Number, required: true},
      address_complementation: String,
      address_reference: String,
      address_district: {type: String, required: true},
      address_city: {type: String, required: true},
      address_zip: {type: String, required: true}
    }, {timestamps: true})
  ),
  typeDef: gql`
    type Owner {
      id: ID!
      name: String
      phone: String
      username: String
      cellphone: String
      properties: [Property]
      lands: [Land]
      documents: [String]
      address_street: String
      address_number: Int
      address_complementation: String
      address_reference: String
      address_district: String
      address_city: String
      address_zip: String
    }
  `,
  resolvers: {
    owners: () => {

    },
    ownerById: () => {

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


