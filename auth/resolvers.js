const Tenant = require('../tenants/Tenant')
const Owner = require("../owners/Owner")
const Admin = require('../admin/Admin')
const {passwordMatch, encrypt} = require('../utils/crypt')
const {createTenant} = require("../tenants/resolvers")
const {createOwner} = require("../owners/resolvers")
const {createAdmin} = require("../admin/resolvers")


module.exports = {
  login: async(args, context)=> {

    try{

      let request = context.request, 
        username = context.username,
        isLogged = false, 
        sessionRestored = false, 
        message = null,
        sessionUsername = null

      if(request.session && context.username){

        isLogged =  true
        sessionRestored = true
        message = `Welcome back, ${context.username}!`
        sessionUsername = context.username

      } else{
        let user = await Tenant.findOne({username: args.username})

        if(!user){
          user = await Owner.findOne({username: args.username})
        }

        if(!user){
          user = await Admin.findOne({username: args.username})
        }

        if(user){
          const isPasswordCorrect = await passwordMatch(args.password, user.password)

          if(isPasswordCorrect){

            context.username = user.username
            message = `Hello, ${context.username}!`
            sessionUsername = context.username
            username = context.username
            isLogged =  true
            sessionRestored = false

          }
        } else{
          message = `User '${args.username}' not found.`
        }
      }
  
      return {isLogged, username, sessionRestored, message, sessionUsername}

    }catch(err){
      console.log(err)
    }    
  },
  logout: (args, request) => {
    if(request.session){
      username = request.session.username
      request.session.destroy()
    }
    return {isLogged: Boolean(request.session), sessionUsername: request.session ? request.session.username : null}
  },
  signIn: async (args, request) => {
    const input = args.input
    const type = args.type
    let sessionUsername = null,
      isSigned = false,
      username = null

    try{
      input.password = await encrypt(input.password)

      if(type === 'tenant' || type === 'owner' || type === 'admin'){
        if(type === 'tenant'){  
          await createTenant(args, request)
        }else if (type === 'owner'){
          await createOwner(args, request)
        } else if(type === 'admin'){
          await createAdmin(args, request)
        }
        isSigned = true
        username = input.username
        sessionUsername = username

      }else{
        console.log("SignIn attempt failed: there's no such type of user.")
      } 
    }catch(err){
      console.log(err)
    }    

    if(request.session){
      request.session.username = input.username
      sessionUsername = request.session.username
    }

    return {
      isSigned,
      sessionUsername,
      username
    }
  }
}