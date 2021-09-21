const Tenant = require("../tenants/Tenant")
const Owner = require("../owners/Owner")
const Land = require("../lands/Land")
const Property = require('../properties/Property')

const {
  checkTenantByUsername,
  checkAdminByUsername,
  checkOwnerByUsername,
  isUser
} = require("../utils/validation")

module.exports = {
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