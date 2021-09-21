const Admin = require('../admin/Admin')
const Land = require('../lands/Land')
const Owner = require('../owners/Owner')
const Property = require('../properties/Property')
const Tenant = require("../tenants/Tenant")

module.exports = {
  isUser: async(username) => {
    if(typeof username === 'string'){
      const isAdmin = await checkAdminByUsername(username)
      const isTenant = await checkTenantByUsername(username)
      const isOwner = await checkOwnerByUsername(username)
      return isAdmin|| isTenant || isOwner
    }
    return false
  },
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