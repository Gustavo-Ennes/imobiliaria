const Mongoose = require("../../database/db")

module.exports = new Mongoose.Schema({
  link: String,
  status: String,
  uploadDate: Date,
  analisysDate: Date,
  analisysMessage: String
})