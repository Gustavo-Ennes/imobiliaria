const Mongoose = require("../database/db")
const DocumentSchema = require('./schemas/DocumentSchema')
const TenantMetaSchema = require('./schemas/TenantMetaSchema')





module.exports =  new Mongoose.model(
  "Tenant",
  new Mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true, unique:true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cellphone: {type: String, required: true, unique: true},
    documents: [DocumentSchema],
    rented: [String],
    address_street: {type: String, required: true},
    address_number: {type: Number, required: true},
    address_complementation: String,
    address_reference: String,
    address_district: {type: String, required: true},
    address_city: {type: String, required: true},
    address_zip: {type: String, required: true},
    meta: {type: Meta}
  }, {timestamps: true})
)