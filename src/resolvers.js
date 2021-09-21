const { passwordMatch, encrypt } = require('../utils/crypt')
const Land = require("./models/Land")
const Owner = require("../owners/Owner")
const Property = require("../properties/Property")
const Tenant = require('./models/Tenant')
const { isUser, checkOwnership, checkOwner, checkAdmin, checkTenantByUsername, checkAdminByUsername, checkOwnerByUsername } = require('../utils/validation')
const Admin = require('../admin/Admin')


let isOwner, isAdmin

const resolvers = {
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
  },
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
  },
  owners: async(args, request) => {
    try{
      return await Owner.find(args.input)
    }catch(err){
      console.log(err)
    }
  },
  ownerById: async(args,request) => {
    try{
      const owner = await Owner.findOne({_id: args.id})
      return owner
    }catch(err){
      console.log(err)
    }    
  },
  createOwner: async(args, request) => {
    try{
      const o = await Owner.create(args.input)
      if(request.session){  
        request.session.username = args.username
      }
      return o
    }catch(err){
      console.log(err)
    }
  },
  updateOwner: async(args, request) => {
    try{
      const owner = await Owner.findOne({_id: args.id})
      await Owner.updateOne({_id: args.id}, {$set: args.input})
      return args.input
    }catch(err){
      console.log(err)
    }
  },
  deleteOwner: async (args, request) => {
    try{
      await Owner.deleteOne({_id: args.id})
      return `Owner id:${args.id} deleted.`
    }catch(err){
      console.log(err)
    }
  },
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
  },
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
      const tenant = await Tenant.findOne({_id: args.id})
      await Tenant.updateOne({_id: args.id}, {$set: args.input})
      return args.input
    }catch(err){
      console.log(err)
    }
  },
  deleteTenant: async (args, request) => {
    await Tenant.deleteOne({_id: args.id})
    return `Tenant id:${args.id} deleted.`
  },
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
          await resolvers.createTenant(args, request)
        }else if (type === 'owner'){
          await resolvers.createOwner(args, request)
        } else if(type === 'admin'){
          await resolvers.createAdmin(args, request)
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
  },
  addDocumentation: async(args, context) => {
    let response = {}, obj = null
    try{
      const isUserATenant = await checkTenantByUsername(context.username)
      const isUserAAdmin = await checkAdminByUsername(context.username)
      const isUserAOwner = await checkOwnerByUsername(context.username)

      if(context.username){        
        
        switch(args.type){
          case 'tenant':
            if(isUserATenant || isUserAAdmin){
              obj = await Tenant.findOne({_id: args.id})
            }
            break
          case 'owner':
            if(isUserAOwner || isUserAAdmin){
              obj = await Owner.findOne({_id: args.id})
            }
            break
          case 'land':
            if(isUserAOwner || isUserAAdmin){
              obj = await Land.findOne({_id: args.id})
            }
            break
          case 'property':
            if(isUserAOwner || isUserAAdmin){
              obj = await Property.findOne({_id: args.id})
            }
            break
          default:
            response.message = "There's no such model in this system"
            response.result = 'fail'
            break
        }

        if(obj){
          const doc = {
            link: args.link,
            status: 'pending',
            uploadDate: new Date()
          }

          if(!obj.documents){
            obj.documents = []
          }
          obj.documents.push(doc)
          await obj.save()

          response.message = `Document ${doc.link} added to ${args.type} ${obj.name || obj._id}`
          response.result = 'success'
        } else{
          response.message = `Wrong type or unauthorized`
          response.result = 'fail'
        }
        
      }else{
        response.message = "The user must be a tenant or a admin!"
        response.result = 'fail'
      }

      return response

    }catch(err){
      console.log(err)
    }
  },
  pendingDocumentation: async(args, context) => {
    let obj, 
        pendingDocuments = {
        tenants: [],
        owners: [],
        lands: [],
        properties: [],
        total: 0,
        message: '',
        status: ''
      }

    const getTotal = () => {
      return pendingDocuments.properties.length + pendingDocuments.lands.length +pendingDocuments.owners.length + pendingDocuments.tenants.length
    }

    

    try{
      if(isUser(context.username)){
        if(Object.keys(args).length){
          switch (args.type) {
            case 'tenant':          
              obj = await Tenant.findOne({_id: args.id})
              pendingDocuments.tenants = obj.documents.filter(doc=> doc.status==='pending')
              pendingDocuments.message = `${pendingDocuments.tenants.length} tenant(s) document(s) pending`
              pendingDocuments.status = 'success'
              break    
            case 'owner':          
              obj = await Owner.findOne({_id: args.id})
              pendingDocuments.owners = obj.documents.filter(doc=>doc.status==='pending')
              pendingDocuments.message = `${pendingDocuments.owners.length} owner(s) document(s) pending`
              pendingDocuments.status = 'success'
              break   
            case 'land':          
              obj = await Land.findOne({_id: args.id})
              pendingDocuments.lands = obj.documents.filter(doc=>doc.status==='pending')
              pendingDocuments.message = `${pendingDocuments.lands.length} land(s) document(s) pending`
              pendingDocuments.status = 'success'
              break   
            case 'property':          
              obj = await Property.findOne({_id: args.id})
              pendingDocuments.properties = obj.documents.filter(doc=>doc.status==='pending')
              pendingDocuments.message = `${pendingDocuments.properties.length} property(ies) document(s) pending`
              pendingDocuments.status = 'success'
              break     
            default:  
              break
          }
        } else{
          const tenants = await Tenant.find()
          const owners = await Owner.find()
          const lands = await Land.find()
          const properties = await Property.find()
          
          tenants.forEach(t => {
            const docs = t.documents.filter(d=>d.status==='pending')
            pendingDocuments.tenants = pendingDocuments.tenants.concat(docs)
          })
          owners.forEach(o => {
            const docs = o.documents.filter(d=>d.status==='pending')
            pendingDocuments.owners = pendingDocuments.owners.concat(docs)
          })
          lands.forEach(l => {
            const docs = l.documents.filter(d=>d.status==='pending')
            pendingDocuments.lands = pendingDocuments.lands.concat(docs)
          })
          properties.forEach(p => {
            const docs = p.documents.filter(d=>d.status==='pending')
            pendingDocuments.properties = pendingDocuments.properties.concat(docs)
          })

          pendingDocuments.message = `
          ${pendingDocuments.tenants.length} documents from tenants
          ${pendingDocuments.owners.length} documents from owners
          ${pendingDocuments.lands.length} documents from lands
          ${pendingDocuments.properties.length} documents from properties
          ${pendingDocuments.properties.length+ 
            pendingDocuments.lands.length+
            pendingDocuments.owners.length+
            pendingDocuments.tenants.length
          } total`

          pendingDocuments.status = 'success'
        }

        pendingDocuments.total = getTotal()
      } else{
        pendingDocuments.message = `Login first!`
        pendingDocuments.status = 'fail'
      }
      
      return pendingDocuments

    }catch(err){
      console.log(err)
    }
  }
}

module.exports = resolvers
