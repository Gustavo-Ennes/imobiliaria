const {gql} = require('graphql-tag')

module.exports = {
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


