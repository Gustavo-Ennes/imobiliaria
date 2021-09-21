const Mongoose = require('mongoose')
const conn = async() => {
  try {
    // for mocha test hooks that didn't use supertest
    if(!process.env.PROD){
      require('dotenv').config()
    }

    await Mongoose.connect(
      process.env.PROD ? process.env.DB_HOST : process.env.DB_HOST_TEST
    )
  } catch (error) {
    console.error(error)
  }
}

conn()

module.exports = Mongoose