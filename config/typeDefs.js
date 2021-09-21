module.exports = `

  type Query{
    admins(input: AdminUpdateInput): [Admin]
    tenants(input: TenantUpdateInput): [Tenant]
    owners(input: OwnerUpdateInput): [Owner]
    properties(input: PropertyUpdateInput): [Property]
    lands(input: LandUpdateInput): [Land]
    adminById(id: ID!): Admin
    tenantById(id: ID!): Tenant
    ownerById(id: ID!): Owner
    propertyById(id: ID!): Property   
    landById(id: ID!): Land
  }

  type Mutation{

    createAdmin(input: AdminCreateInput): Admin
    updateAdmin(id: ID!, input: AdminUpdateInput): Admin
    deleteAdmin(id: ID!): String

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

    login(username: String!, password: String!): AuthReturn
    logout(username: String): AuthReturn
    signIn(input: OwnerCreateInput!, type: String!): AuthReturn

    addDocumentation(link: String!, type:String!, id: ID!): AddDocumentResponse
    pendingDocumentation(id: ID, type: String): PendingDocumentResponse
  
  }

  type AuthReturn{
    isSigned: Boolean
    isLogged: Boolean
    username: String
    sessionRestored: Boolean
    message: String
    sessionUsername: String
  }

  ${require('../admin/typeDefs')}
  ${require('../tenants/typeDefs')}
  ${require('../lands/typeDefs')}
  ${require('../owners/typeDefs')}
  ${require('../properties/typeDefs')}
  ${require('../documentation/typeDefs')}

`