const {gql} = require('graphql-tag')
const Mongoose = require("../database/db")

const Property = new Mongoose.model(
  "Property",
  new Mongoose.Schema({
    ownerId: {type: String, required: true},
    tenantId: String,
    bedrooms: {type: Number, required: true},
    bathrooms: {type: Number, required: true},
    parkingSpaces: {type: Number, required: true},
    size: {type: Number, required: true},
    privateSize: {type: Number, required: true},
    infrastructures: [String],
    characteristics: [String],
    documents: [String],
    address_street: {type: String, required: true},
    address_number: {type: Number, required: true},
    address_complementation: String,
    address_reference: String,
    address_district: {type: String, required: true},
    address_city: {type: String, required: true},
    address_zip: {type: String, required: true},
    value_rent: Number,
    value_sell: Number,
    value_rentPercentage: Number,
    value_sellPercentage: Number
  }, {timestamps: true})
)

module.exports = {
  mongoose: Property,
  typeDef: gql`
    type Property{
      id: ID!
      ownerId: ID!
      tenantId: ID
      bedrooms: Int
      bathrooms: Int
      parkingSpaces: Int
      size: Float
      privateSize: Float
      documents: [String]
      characteristics: [String]
      infrastructures: [String]
      address_street: String
      address_number: Int
      address_complementation: String
      address_reference: String
      address_district: String
      address_city: String
      address_zip: String
      value_rent: Float
      value_sell: Float
      value_rentPercentage: Float
      value_sellPercentage: Float
      views: Int
      shares: Int
      likes: Int
    }
  `,
  resolvers: {
    properties: async(parent, args, context, info) => {
      try{
        return await Property.find()
      }catch(err){
        console.log(err)
      }
    },
    propertyById: async(parent, args, context, info) => {
      const property = await Property.findOne({_id: args.id})
      return property
    }
  },

  mutations: {
    create: async(parent, args, context, info) => {
      try{
        await Property.create(args.input)
        return args.input
      }catch(err){
        console.log(err)
      }
    },
    update: async(parent, args, context, info) => {
      try{
        const property = await Property.findOne({_id: args.id})
        console.log(`property: ${property}`)
        await Property.updateOne({_id: args.id}, {$set: args.input})
        return args.input
      }catch(err){
        console.log(err)
      }
    },
    delete: async (parent, args, context, info) => {
      await Property.deleteOne({_id: args.id})
      return `Property id:${args.id} deleted.`
    }
  }

}