const Mongoose = require("../database/db")

module.exports = new Mongoose.model(
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