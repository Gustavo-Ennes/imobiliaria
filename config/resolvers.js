const adminResolvers = require('../admin/resolvers')
const landResolvers = require('../lands/resolvers')
const propertyResolvers = require('../properties/resolvers')
const ownerResolvers = require('../owners/resolvers')
const tenantResolvers = require('../tenants/resolvers')
const documentResolvers = require('../documentation/resolvers')
const loginResolvers = require('../auth/resolvers')

module.exports = {
  ...loginResolvers,
  ...adminResolvers,
  ...landResolvers,
  ...propertyResolvers,
  ...ownerResolvers,
  ...tenantResolvers,
  ...documentResolvers
}