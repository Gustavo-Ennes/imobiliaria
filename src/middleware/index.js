const Tenant = require("../models/Tenant").mongoose
const Owner = require("../models/Owner").mongoose

const isPasswordCorrect = async(inserted, original) => {
  bcrypt.compare(inserted, original, function(err, result) {
    if(err)console.log(err);
    return result
  });
}

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
        const isValid = await isPasswordCorrect(args.username, user.username)
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

  singInResolver: (parent, args, context, info) => {
    
  }
}