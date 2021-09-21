const Admin = require('./Admin')

module.exports = {
  admins: async(args, request) => {
    try{
      return await Admin.find(args.input)
    }catch(err){
      console.log(err)
    }
  },
  adminById: async(args, request) => {
    const a = await Admin.findOne(args.input)
    return a
  },
  createAdmin: async(args, request) => {
    try{      
        const a  = await Admin.create(args.input)
        return a
      }catch(err){
      console.log(err)
    }
  },
  updateAdmin: async(args, request)=> {
    try{
      await Admin.updateOne({_id: args.id}, {$set: args.input})
      const a = await Admin.findOne({_id: args.id})
      return a
    }catch(err){
      console.log(err)
    }
  },
  deleteAdmin: async(args, request) => {
    try{
      await Admin.deleteOne({_id: args.id})
      return `Admin id ${args.id} deleted`
    }catch(err){
      console.log(err)
    }
  }
}