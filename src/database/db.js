const Mongoose = require('mongoose');

const connect = async() => {
  await Mongoose.connect(process.env.TEST ? process.env.DB_HOST_TEST : process.env.DB_HOST_TEST);
  var db = Mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    console.log("database connected.");
    isDatabaseOpened = true
  })
}

connect()

module.exports = Mongoose