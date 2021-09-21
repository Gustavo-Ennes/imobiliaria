module.exports = `
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

  input LandCreateInput{
  
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
    value_sell: Float,
    value_sellPercentage: Float
  }
  
  input LandUpdateInput{
    ownerId: ID,
    size: Float,
    infrastructures: [String],
    documents: [String],
    address_street: String,
    address_number: Int,
    address_complementation: String,
    address_reference: String,
    address_district: String,
    address_city: String,
    address_zip: String,
    value_rent: Float,
    value_sell: Float,
    value_rentPercentage: Float,
    value_sellPercentage: Float
  }
`
