const Tenant = require("../models/Tenant").mongoose
const Owner = require("../models/Owner").mongoose
const {passwordMatch, encrypt} = require("../../utils/cyrpt")
const createTenant = require('../../src/models/Tenant').mutations.create
const createOwner = require('../../src/models/Tenant').mutations.create

module.exports = {

  loginResolver: async(parent, args, context, info)=> {
    let isLogged = false
    // if sessions exists
    if(session.username === args.username){
      isLogged = true
    } else{
      const user = await Tenant.findOne({username: args.username})

      if(!user){
        // try see if user is an owner
        user = await Owner.findOne({username: args.username})    
      }
      if(user){
        const isValid = await passwordMatch(args.username, user.username)
        if(isValid){  
          isLogged = true
        }
      } 
    }
    return isLogged
  },

  logoutResolver: (parent, args, context, info) => {
    if(context.req.session){
      context.req.session.destroy()
    }
    return true
  },

  signInResolver: async (parent, args, context, info) => {
    const input = args.input
    const type = args.type

    try{

      input.password = await encrypt(input.password)

      if(type === 'tenant'){  
        await createTenant(parent, args, context, info)
      }else if (type === 'owner'){
        await createOwner(parent, args, context, info)
      }else{
        console.log("SignIn attempt failed: there's no such type of user.")
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }    
    return true
  }
}