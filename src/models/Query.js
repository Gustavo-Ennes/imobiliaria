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

    login(username: String, password: String): Boolean
    logout(username: String): Boolean
    # the type here is to say if it's an Owner or a Tenant
    # implement this with sessions 
    signIn(input: OwnerCreateInput, type: String): Boolean
    
  }
`

