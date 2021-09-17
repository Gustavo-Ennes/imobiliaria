const Admin = require('../src/models/Admin')
const Owner = require('../src/models/Owner')

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
    if(username instanceof String){
      const t = await Tenant.findOne({username})
      return (t instanceof Tenant)
    }
    return false
  },
  checkAdminByUsername: async(username) => {
    if(username instanceof String){
      const a = await Admin.findOne({username})
      return (a instanceof Admin)
    }
    return false
  }
}