const {gql} = require('graphql-tag')

module.exports = {
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
      value_rent: Float
      value_sell: Float
      value_rentPercentage: Float
      value_sellPercentage: Float
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