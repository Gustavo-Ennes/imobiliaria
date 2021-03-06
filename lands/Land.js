const Mongoose = require("../database/db")
const DocumentSchema = require('../documentation/schemas/DocumentSchema')

module.exports = new Mongoose.model(
  "Land",
  new Mongoose.Schema({
    ownerId: {type: String, required: true},
    size: {type: Number, required: true},
    infrastructures: [String],
    documents: [
      DocumentSchema
    ],
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
