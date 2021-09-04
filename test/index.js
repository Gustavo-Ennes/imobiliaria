const chai = require('chai')
const expect = chai.expect
const chaiHTTP = require("chai-http")
const client = require('../src/database/db')
const app = require('../app')

chai.use(chaiHTTP)

describe("Database connection", () => {
  it("Should connect with database", async () => {
    try{
      await client.connect()
    }catch(err){
      console.log(err)
      expect("Database connected").to.equal("Database disconnected")
    } finally{
      await client.close()
      expect(1).to.equal(1)
    }
  })
})

describe("Database insertions", async () => {

  before(async () => {
    const db = client.db('imobiliaria')
    const coll = db.collection('owner')
    const doc = {
      name: "Gustavo",
      phone: "120389713",
      username: "kratos",
      cellphone: "23123231",
      address_street: "17",
      address_number: ""
    }
  })
})