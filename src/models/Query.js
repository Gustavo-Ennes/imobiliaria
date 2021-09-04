const {gql} = require('graphql-tag')

module.exports = gql`
  type Query{
    tenants: [Tenant]
    owners: [Owner]
    properties: [Property]
    lands: [Land]
    tenantById(id: ID!): Tenant
    ownerById(id: ID!): Owner
    propertyById(id: ID!): Property   
    landById(id: ID!): Land
  }

  type Mutation{

    createProperty(input: PropertyInput): Property
    updateProperty(id:ID!, input: PropertyInput): Property
    deleteProperty(id: ID): String

    createLand(input: LandInput): Land
    updateLand(id: ID!, input: LandInput): Land
    deleteLand(id: ID!): String

    createOwner(input: OwnerInput): Owner
    updateOwner(id: ID!, input: OwnerInput): Owner
    deleteOwner(id: ID!): String

    createTenant(input: TenantInput): Tenant
    updateTenant(id: ID!, input:TenantInput): Tenant
    deleteTenant(id: ID!): String
    
  }
`

