require("dotenv").config()

const mongoose = require('mongoose');

const connect = async() => {
  await mongoose.connect(process.env.DB_HOST);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    console.log("database connected.");
  })
}

connect()

module.exports = mongoose