const Tenant = require('./Tenant')

module.exports = {

  tenants: async(args, request) => {
    try{
      return await Tenant.find(args.input)
    }catch(err){
      console.log(err)
    }
  },
  tenantsById: async(args, request) => {
    try{
      const tenant = await Tenant.findOne({_id: args.id})
      return tenant
    }catch(err){
      console.log(err)
    }
  },
  createTenant: async(args, request) => {
    try{
      const t = await Tenant.create(args.input)
      if(request.session){
        request.session.username = args.username
      }
      return t
    }catch(err){
      console.log(err)
    }
  },
  updateTenant: async(args, request) => {
    try{
      await Tenant.findOne({_id: args.id})
      await Tenant.updateOne({_id: args.id}, {$set: args.input})
      return args.input
    }catch(err){
      console.log(err)
    }
  },
  deleteTenant: async (args, request) => {
    await Tenant.deleteOne({_id: args.id})
    return `Tenant id:${args.id} deleted.`
  }
}