require("dotenv").config()

const chai = require('chai')
const expect = chai.expect
const Mongoose = require("../../src/database/db")



describe("Database connection", () => {
  it("Should be connected to Atlas", async() => {

    try{
      await Mongoose.connect(process.env.DB_HOST_TEST)
      expect(Mongoose.connection.readyState).to.equal(1)
    } catch(err){
      console.log(err)
    }

  })
})
