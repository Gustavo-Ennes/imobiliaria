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

    try{
      await Mongoose.connect(process.env.DB_HOST_TEST)
      expect(Mongoose.connection.readyState).to.equal(1)
    } catch(err){
      console.log(err)
    }

  })
})

describe("Integration", () =>{
  tenantsTests
  ownersTests
  landTests
  propertyTests
})

describe("Authentication", () => {
  
})
