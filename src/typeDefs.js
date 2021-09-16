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

type AuthReturn{
  isSigned: Boolean
  isLogged: Boolean
  username: String
  sessionRestored: Boolean
  message: String
  sessionUsername: String
}

type DocumentResponse{
  message: String
  result: String
}

type Query{
  tenants(input: TenantUpdateInput): [Tenant]
  owners(input: OwnerUpdateInput): [Owner]
  properties(input: PropertyUpdateInput): [Property]
  lands(input: LandUpdateInput): [Land]
  tenantById(id: ID!): Tenant
  ownerById(id: ID!): Owner
  propertyById(id: ID!): Property   
  landById(id: ID!): Land
}

type Mutation{

  createProperty(input: PropertyCreateInput): Property
  updateProperty(id:ID!, input: PropertyUpdateInput): Property
  deleteProperty(id: ID): String

  createLand(input: LandCreateInput): Land
  updateLand(id: ID!, input: LandUpdateInput): Land
  deleteLand(id: ID!): String

  createOwner(input: OwnerCreateInput): Owner
  updateOwner(id: ID!, input: OwnerUpdateInput): Owner
  deleteOwner(id: ID!): String

  createTenant(input: TenantCreateInput): Tenant
  updateTenant(id: ID!, input:TenantUpdateInput): Tenant
  deleteTenant(id: ID!): String

  login(username: String, password: String): AuthReturn
  logout(username: String): AuthReturn
  # the type here is to say if it's an Owner or a Tenant
  # implement this with sessions 
  signIn(input: OwnerCreateInput, type: String): AuthReturn

  addDocumentation(link: String): DocumentResponse
  
}

${require("./inputs")}

`