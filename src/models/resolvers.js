const landResolvers = require('./Land').resolvers
const propertyResolvers = require('./Property').resolvers
const tenantResolvers = require("./Tenant").resolvers
const ownerResolvers = require("./Owner").resolvers
const landMutations = require('./Land').mutations
const propertyMutations = require('./Property').mutations
const tenantMutations = require("./Tenant").mutations
const ownerMutations = require("./Owner").mutations
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
    deleteTenant: tenantMutations.delete
  }
}