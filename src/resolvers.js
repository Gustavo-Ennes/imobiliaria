const landResolvers = require('./models/Land').resolvers
const propertyResolvers = require('./models/Property').resolvers
const tenantResolvers = require("./models/Tenant").resolvers
const ownerResolvers = require("./models/Owner").resolvers
const landMutations = require('./models/Land').mutations
const propertyMutations = require('./models/Property').mutations
const tenantMutations = require("./models/Tenant").mutations
const ownerMutations = require("./models/Owner").mutations
const {loginResolver, logoutResolver, signInResolver} = require("./middleware/index")



module.exports = {
  Query:{
    lands:  landResolvers.lands,
    landById: landResolvers.landById,
    properties: propertyResolvers.properties,
    propertyById: propertyResolvers.propertyById,
    tenants: tenantResolvers.tenants,
    tenantById: tenantResolvers.tenantsById,
    owners: ownerResolvers.owners,
    ownerById: ownerResolvers.ownerById
  },
  Mutation:{
    createLand: landMutations.create,
    updateLand: landMutations.update,
    deleteLand: landMutations.delete,
    createProperty: propertyMutations.create,
    updateProperty: propertyMutations.update,
    deleteProperty: propertyMutations.delete,
    createOwner: ownerMutations.create,
    updateOwner: ownerMutations.update,
    deleteOwner: ownerMutations.delete,
    createTenant: tenantMutations.create,
    updateTenant: tenantMutations.update,
    deleteTenant: tenantMutations.delete,
    login: loginResolver,
    logout: logoutResolver,
    signIn: signInResolver
  }
}