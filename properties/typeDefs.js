module.exports = `
  type Property{
    id: ID!
    ownerId: ID!
    tenantId: ID
    bedrooms: Int
    bathrooms: Int
    parkingSpaces: Int
    size: Float
    privateSize: Float
    documents: [String]
    characteristics: [String]
    infrastructures: [String]
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
    views: Int
    shares: Int
    likes: Int
  }


  input PropertyCreateInput{
    ownerId: ID!,
    tenantId: ID,
    bedrooms: Int!,
    bathrooms: Int!,
    parkingSpaces: Int!,
    size: Float!,
    privateSize: Float!,
    documents: [String],
    characteristics: [String]!,
    infrastructures: [String]!,
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

  input PropertyUpdateInput{
    ownerId: ID,
    tenantId: ID,
    bedrooms: Int,
    bathrooms: Int,
    parkingSpaces: Int,
    size: Float,
    privateSize: Float,
    documents: [String],
    characteristics: [String],
    infrastructures: [String],
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
    value_sellPercentage: Float,
    views: Int,
    shares: Int,
    likes: Int
  }


`