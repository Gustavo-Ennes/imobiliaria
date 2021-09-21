const Property = require('../properties/Property')
const {checkOwner, checkAdmin} = require('../utils/validation')

module.exports = {

  properties: async(args, request) => {
    try{
      return await Property.find(args.input)
    }catch(err){
      console.log(err)
    }
  },
  propertyById: async(args, request) => {
    try{
      const property = await Property.findOne({_id: args.id})
      return property
    }catch(err){
      console.log(err)
    }
  },
  createProperty: async(args, request) => {
    try{
      isOwner = await checkOwner(args.input.ownerId)
      isAdmin = await checkAdmin(args.input.ownerId)
      let p = null

      if(isOwner || isAdmin){
        p = await Property.create(args.input)
      }
      return p
    }catch(err){
      console.log(err)
    }
  },
  updateProperty: async(args, request) => {
    try{
      const property = await Property.findOne({_id: args.id})
      await Property.updateOne({_id: args.id}, {$set: args.input})
      return args.input
    }catch(err){
      console.log(err)
    }
  },
  deleteProperty: async (args, request) => {
    try{
      await Property.deleteOne({_id: args.id})
      return `Property id:${args.id} deleted.`
    }catch(err){
      console.log(err)
    }
  }
}