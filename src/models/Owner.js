const {gql} = require('graphql-tag')
const Mongoose = require("../database/db")

const Owner = new Mongoose.model(
  "Owner",
  new Mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true, unique:true},
    username: {type: String, required: true, unique: true},
    cellphone: {type: String, required: true, unique: true},
    documents: [String],
    properties: [String],
    lands: [String],
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

  mongoose: Owner,
  typeDef: gql`
    type Owner {
      id: ID!
      name: String
      phone: String
      username: String
      cellphone: String
      properties: [Property]
      lands: [Land]
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
    owners: async(parent, args, context, info) => {
      try{
        return await Owner.find()
      }catch(err){
        console.log(err)
      }
    },
    ownerById: async(parent, args, context, info) => {
      const owner = await Owner.findOne({_id: args.id})
      return owner
    }
  },

  // TESTAR MUTATIONS E RESOLVERS
  mutations: {
    create: async(parent, args, context, info) => {
      try{
        console.log(JSON.stringify(args.input, null, 2))
        await Owner.create(args.input)
        return args.input
      }catch(err){
        console.log(err)
      }
    },
    update: async(parent, args, context, info) => {
      try{
        const owner = await Owner.findOne({_id: args.id})
        console.log(`owner: ${owner}`)
        await Owner.updateOne({_id: args.id}, {$set: args.input})
        return args.input
      }catch(err){
        console.log(err)
      }
    },
    delete: async (parent, args, context, info) => {
      await Owner.deleteOne({_id: args.id})
      return `Owner id:${args.id} deleted.`
    }
  }
}


