const Land = require('./Land')
const {checkOwner, checkAdmin, checkOwnership} = require('../utils/validation')

module.exports = {
  lands: async(args, request) => {
    try{
        return await Land.find(args.input)
      }catch(err){
        console.log(err)
    }
  },
  landById: async(args, request) => {
    const land = await Land.findOne({_id: args.id})
    return land
  },  
  createLand: async(args, request) => {
    try{
      let land = null
      isOwner = await checkOwner(args.input.ownerId)
      isAdmin = await checkAdmin(args.input.ownerId)
      
      if(isOwner || isAdmin){
        land = await Land.create(args.input)
      }
      return land
    }catch(err){
      console.log(err)
    }
  },
  updateLand: async(args, context) => {
    try{
      const isOwner = await checkOwnership(context.username, 'land', args.id)
      if(isOwner){
        await Land.updateOne({_id: args.id}, {$set: args.input})
        const land = await Land.findOne({_id: args.id})
        return land
      }
      return null
    }catch(err){
      console.log(err)
    }
  },
  deleteLand: async(args, context) => {
    try{
      const isOwner = await checkOwnership(context.username, 'land', args.id)
      
      if(isOwner){
        await Land.deleteOne({_id: args.id})
        return `Land id:${args.id} deleted.`
      } 
      return 'fail'
    }catch(err){
      console.log(err)
    }
  }
}