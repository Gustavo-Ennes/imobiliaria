const { passwordMatch, encrypt } = require('../utils/crypt')
const Land = require("./models/Land")
const Owner = require("./models/Owner")
const Property = require("./models/Property")
const Tenant = require('./models/Tenant')
const {isLink, isPdf} = require('../utils/documentation')

const resolvers = {
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
      const land = await Land.create(args.input)
      return land
    }catch(err){
      console.log(err)
    }
  },
  updateLand: async(args, request) => {
    try{
      const land = await Land.findOne({_id: args.id})
      await Land.updateOne({_id: args.id}, {$set: args.input})
      return args.input
    }catch(err){
      console.log(err)
    }
  },
  deleteLand: async(args, request) => {
    try{
      await Land.deleteOne({_id: args.id})
      return `Land id:${args.id} deleted.`
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
      const p = await Property.create(args.input)
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
  login: async(args, request)=> {
    let isLogged = false, 
      sessionRestored = false, 
      username = null,
      message = null,
      sessionUsername = null
    const password = '12345'

    try{

      if(request.session && request.session.userID){
        isLogged =  true
        username = res.username
        sessionRestored = true

      } else{
        let user = await Tenant.findOne({username: args.username})
        if(!user){
          user = await Owner.findOne({username: args.username})

          if(user){
            const isPasswordCorrect = await passwordMatch(password, user.password)
            if(isPasswordCorrect){

              username = user.username
              if(request.session){
                request.session.username = user.username
              }
              isLogged = true
              message = `Hello, ${username}!`
            }
          } else{
            message = `User '${args.username}' not found.`
          }
        } else {
          isLogged = true
          username = user.username
          message = `Hello, ${username}!`
        }
      }
    }catch(err){
      console.log(err)
    }
    if(request.session){
      sessionUsername = request.session.username
    }
    return {isLogged, username, sessionRestored, message, sessionUsername}
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

      if(type === 'tenant' || type === 'owner'){
        if(type === 'tenant'){  
          await resolvers.createTenant(args, request)
        }else if (type === 'owner'){
          await resolvers.createOwner(args, request)
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
  addDocumentation: async(args, request) => {
    let response = {}, obj  

    try{

      if(request.session.username){

        switch(args.type){
          case 'tenant':
            obj = await Tenant.findOne({_id: request.session.id})
            break
          case 'owner':
            obj = await Owner.findOne({_id: request.session.id})
            break
          case 'land':
            obj = await Land.findOne({_id: request.session.id})
            break
          case 'property':
            obj = await Property.findOne({_id: request.session.id})
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
        }
        
      }else{
        response.message = "Log in first!"
        response.result = 'fail'
      }
      return response
    }catch(err){
      console.log(err)
    }
  },
  pendingDocumentation: async(args, request) => {
    let obj, 
        pendingDocuments = {
        tenants: [],
        owners: [],
        lands: [],
        properties: []
      }

    const getTotal = () => {
      return pendingDocuments.properties.length+ 
        pendingDocuments.lands.length+
        pendingDocuments.owners.length+
        pendingDocuments.tenants.length
    }

    try{
      switch (args.type) {
        case 'tenant':          
          obj = await Tenant.findOne({_id: args.id})
          pendingDocuments.tenants.concat(obj.documents.filter(doc=>doc.status==='pending'))
          pendingDocuments.message = `${pendingDocuments.tenants.length} tenant(s) document(s) pending`
          pendingDocuments.status = 'success'
          break    
        case 'owner':          
          obj = await Owner.findOne({_id: args.id})
          pendingDocuments.owners.concat(obj.documents.filter(doc=>doc.status==='pending'))
          pendingDocuments.message = `${pendingDocuments.owners.length} owner(s) document(s) pending`
          pendingDocuments.status = 'success'
          break   
        case 'land':          
          obj = await Land.findOne({_id: args.id})
          pendingDocuments.lands.concat(obj.documents.filter(doc=>doc.status==='pending'))
          pendingDocuments.message = `${pendingDocuments.lands.length} land(s) document(s) pending`
          pendingDocuments.status = 'success'
          break   
        case 'property':          
          obj = await Property.findOne({_id: args.id})
          pendingDocuments.properties.concat(obj.documents.filter(doc=>doc.status==='pending'))
          pendingDocuments.message = `${pendingDocuments.properties.length} property(ies) document(s) pending`
          pendingDocuments.status = 'success'
          break     
        default:
          const tenants = await Tenant.find()
          const owners = await Owner.find()
          const lands = await Land.find()
          const properties = await Property.find()
          
          tenants.forEach(t => {
            pendingDocuments.tenants.concat(t.documents.filter(d=>d.status==='pending'))
          })
          owners.forEach(o => {
            pendingDocuments.owners.concat(o.documents.filter(d=>d.status==='pending'))
          })
          lands.forEach(l => {
            pendingDocuments.owners.concat(l.documents.filter(d=>d.status==='pending'))
          })
          properties.forEach(p => {
            pendingDocuments.properties.concat(p.documents.filter(d=>d.status==='pending'))
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

      return pendingDocuments

    }catch(err){
      console.log(err)
    }
  }
}

module.exports = resolvers
