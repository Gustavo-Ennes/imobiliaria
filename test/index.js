require("dotenv").config()

const chai = require('chai')
const expect = chai.expect
const Mongoose = require("mongoose")
const tenantsTests = require('./tenants')
const ownersTests = require("./owners")
const landTests = require('./lands')
const propertyTests = require('./properties')


describe("Database connection", () => {
  it("Should be connected to Atlas", async() => {

    const connect = async() => {
      await Mongoose.connect(process.env.DB_HOST_TEST);
      var db = Mongoose.connection;
      db.on('error', () => { expect(0).to.equal(1) });
      db.once('open', function callback () {
        expect(1).to.equal(1)
      })
    }
    
    await connect()

  })
})


describe("Integration", () =>{
  tenantsTests
  ownersTests
  landTests
  propertyTests
})
