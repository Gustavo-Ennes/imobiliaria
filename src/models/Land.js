const {gql} = require('graphql-tag')
const Mongoose = require("../database/db")

const Land = new Mongoose.model(
  "Land",
  new Mongoose.Schema({
    ownerId: {type: String, required: true},
    size: {type: Number, required: true},
    infrastructures: [String],
    documents: [String],
    address_street: {type: String, required: true},
    address_number: {type: Number, required: true},
    address_complementation: String,
    address_reference: String,
    address_district: {type: String, required: true},
    address_city: {type: String, required: true},
    address_zip: {type: String, required: true},
    value_sell: Number,
  }, {timestamps: true})
)


module.exports = {
  mongoose: Land,
  typeDef: gql`
    type Land{
      id: ID!
      ownerId: ID!
      size: Float
      infrastructures: [String]
      documents: [String]
      address_street: String
      address_number: Int
      address_complementation: String
      address_reference: String
      address_district: String
      address_city: String
      address_zip: String
      value_sell: Float
      value_rentPercentage: Float
    }
  `,
  resolvers: {
    lands: async(parent, args, context, info) => {
      try{
        return await Land.find()
      }catch(err){
        console.log(err)
      }
    },
    landById: async(parent, args, context, info) => {
      const land = await Land.findOne({_id: args.id})
      return land
    }
  },

  // TESTAR MUTATIONS E RESOLVERS
  mutations: {
    create: async(parent, args, context, info) => {
      try{
        console.log(JSON.stringify(args.input, null, 2))
        await Land.create(args.input)
        return args.input
      }catch(err){
        console.log(err)
      }
    },
    update: async(parent, args, context, info) => {
      try{
        const land = await Land.findOne({_id: args.id})
        console.log(`land: ${land}`)
        await Land.updateOne({_id: args.id}, {$set: args.input})
        return args.input
      }catch(err){
        console.log(err)
      }
    },
    delete: async (parent, args, context, info) => {
      await Land.deleteOne({_id: args.id})
      return `Land id:${args.id} deleted.`
    }
  }
}