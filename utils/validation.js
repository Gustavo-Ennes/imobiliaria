const Admin = require('../src/models/Admin')
const Owner = require('../src/models/Owner')
const Tenant = require("../src/models/Tenant")

module.exports = {
  checkOwner: async(ownerId) => {
    const o = await Owner.findOne({_id: ownerId})
    return (o instanceof Owner)
  },
  checkAdmin: async(adminId) => {
    const a = await Admin.findOne({_id: adminId})
    return (a instanceof Admin)
  },
  checkTenantByUsername: async(username) => {
    if(typeof username === 'string'){
      const t = await Tenant.findOne({username})
      return (t instanceof Tenant)
    }
    return false
  },
  checkAdminByUsername: async(username) => {
    if(typeof username === 'string'){
      const a = await Admin.findOne({username})
      return (a instanceof Admin)
    }
    return false
  },
  checkOwnerByUsername: async(username) => {
    if(typeof username === 'string'){
      const o = await Owner.findOne({username})
      return (o instanceof Owner)
    }
    return false
  }
}