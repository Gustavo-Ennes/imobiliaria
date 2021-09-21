module.exports = `

  type Owner{
    id: ID!
    name: String
    phone: String
    username: String
    password: String
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
    createdAt: String
    modifiedAt: String
  }

  input OwnerCreateInput{
    name: String!,
    phone: String!,
    username: String!,
    cellphone: String!,
    password: String!,
    documents: [String],
    address_street: String!,
    address_number: Int!,
    address_complementation: String,
    address_reference: String,
    address_district: String!,
    address_city: String!,
    address_zip: String!
  }
  
  input OwnerUpdateInput{
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