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
  }
}