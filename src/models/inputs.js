const {gql} = require('graphql-tag')

module.exports = gql`input TenantInput{
  name: String!,
  phone: String!,
  username: String!,
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

input OwnerInput{
  name: String!,
  phone: String!,
  username: String!,
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

input PropertyInput{
  ownerId: ID!,
  tenantId: ID,
  bedrooms: Int!,
  bathrooms: Int!,
  parkingSpaces: Int!,
  size: Float!,
  privateSize: Float!,
  documents: [String],
  characteristics: [String]!,
  infrastructure: [String]!,
  address_street: String!,
  address_number: Int!,
  address_complementation: String,
  address_reference: String,
  address_district: String!,
  address_city: String!,
  address_zip: String!,
  value_rent: Float,
  value_sell: Float,
  value_rentPercentage: Float,
  value_sellPercentage: Float,
  views: Int,
  shares: Int,
  likes: Int
}

input LandInput{
  
  ownerId: ID!,
  size: Float!,
  infrastructures: [String]!,
  documents: [String],
  address_street: String!,
  address_number: Int!,
  address_complementation: String,
  address_reference: String,
  address_district: String!,
  address_city: String!,
  address_zip: String!,
  value_rent: Float,
  value_sell: Float,
  value_rentPercentage: Float,
  value_sellPercentage: Float
}`

