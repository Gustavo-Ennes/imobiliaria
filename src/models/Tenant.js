const {gql} = require('graphql-tag')
const Mongoose = require("../database/db")

const Tenant =  new Mongoose.model(
  "Tenant",
  new Mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true, unique:true},
    username: {type: String, required: true, unique: true},
    cellphone: {type: String, required: true, unique: true},
    documents: [String],
    rented: [String],
    address_street: {type: String, required: true},
    address_number: {type: Number, required: true},
    address_complementation: String,
    address_reference: String,
    address_district: {type: String, required: true},
    address_city: {type: String, required: true},
    address_zip: {type: String, required: true}
  }, {timestamps: true})
)

module.exports = {
  mongoose: Tenant,
  typeDef: gql`
    type Tenant{  
      id: ID!
      name: String
      phone: String
      username: String
      cellphone: String
      rented: [Property]
      documents: [String]
      address_street: String
      address_number: Int
      address_complementation: String
      address_reference: String
      address_district: String
      address_city: String
      address_zip: String
    }
  `,
  resolvers: {
    tenants: async(parent, args, context, info) => {
      try{
        return await Tenant.find()
      }catch(err){
        console.log(err)
      }
    },
    tenantsById: async(parent, args, context, info) => {
      const tenant = await Tenant.findOne({id: args.id})
      return tenant
    }
  },

  // TESTAR MUTATIONS E RESOLVERS
  mutations: {
    create: async(parent, args, context, info) => {
      try{
        await Tenant.create(args.input)
        return args.input
      }catch(err){
        console.log(err)
      }
    },
    update: async(parent, args, context, info) => {
      try{
        const tenant = await Tenant.findOne({_id: args.id})
        console.log(`tenant: ${tenant}`)
        await Tenant.updateOne({_id: args.id}, {$set: args.input})
        return args.input
      }catch(err){
        console.log(err)
      }
    },
    delete: async (parent, args, context, info) => {
      await Tenant.deleteOne({_id: args.id})
      return `Tenant id:${args.id} deleted.`
    }
  }

}