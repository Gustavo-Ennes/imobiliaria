const { KnownFragmentNamesRule } = require('graphql/validation')
const Admin = require('../src/models/Admin')
const Land = require('../src/models/Land')
const Owner = require('../src/models/Owner')
const Property = require('../src/models/Property')
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
  },
  checkOwnership: async(username, type, id) => {

     const admin = await Admin.findOne({username}) 
     let obj

     if(!admin){
      const owner = await Owner.findOne({username})

      if(owner){

        if(type === 'land'){
          obj = await Land.findOne({_id: id})
        } else if(type === 'property'){
          obj = await Property.findOne({_id: id}) 
        }

        if(obj){

          if(String(obj.ownerId).normalize() === String(owner._id).normalize()){
            return true
          }
        }
      }

    } else{
      return true
    }  
    return false
  }
}