const Mongoose = require("../database/db")
const DocumentSchema = require('../documentation/schemas/DocumentSchema')

module.exports = new Mongoose.model(
  "Owner",
  new Mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true, unique:true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cellphone: {type: String, required: true, unique: true},
    documents: [DocumentSchema],
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