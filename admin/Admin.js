const Mongoose = require("mongoose");

module.exports = new Mongoose.model(
  "Admin",
  new Mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true, unique:true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  })
)