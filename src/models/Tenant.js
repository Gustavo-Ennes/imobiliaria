const {gql} = require('graphql-tag')

module.exports = {
  typeDef: gql`
    type Tenant{  
      id: ID!
      name: String
      phone: String
      username: String
      cellphone: String
      rented: [Property]
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
    tenants: () => {

    },
    tenantsById: () => {

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