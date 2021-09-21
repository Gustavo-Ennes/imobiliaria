module.exports = `

  type Tenant{  
    id: ID!
    name: String
    phone: String
    username: String
    password: String
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
    createdAt: String
    updatedAt: String
  }

  input TenantCreateInput{
    name: String!,
    phone: String!,
    username: String!,
    password: String!,
    cellphone: String!,
    documents: [String],
    address_street: String!,
    address_number: Int!,
    address_complementation: String,
    address_reference: String,
    address_district: String!,
    address_city: String!,
    address_zip: String!
  }
  input TenantUpdateInput{
    name: String,
    phone: String,
    username: String,
    cellphone: String,
    documents: [String],
    address_street: String,
    address_number: Int,
    address_complementation: String,
    address_reference: String,
    address_district: String,
    address_city: String,
    address_zip: String
  }

`