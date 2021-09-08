require("dotenv").config()

const chai = require('chai')
const expect = chai.expect
const Mongoose = require("mongoose")
const tenantsTests = require('./integration/tenants')
const ownersTests = require("./integration/owners")
const landTests = require('./integration/lands')
const propertyTests = require('./integration/properties')
const { simplePassword } = require("../utils/cyrpt")
const {gql} = require('graphql-tag')




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
  describe("Sign In", () => {
    it("Should add a user of type tenant", async() => {

      const query = gql`
        mutation{
          signIn(
            type: "tenant",
            input:{
              name: "Gustavo Ennes",
              password: "${simplePassword}"
              phone: "18 1923876134",
              username: "kratos.de.si",
              cellphone: "18 0192384783",
              address_street: "17",
              address_number: 212,
              address_district: "SP",
              address_city: "Ilha Solteira",
              address_zip: "15.385-000"
            }
          )
        }
      `
      request(app)
        .post('/graphql')
        .send({query})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if(err){
            console.log(err)
            done(err)
          } else{
            console.log(res.body.data)
            done()
          }
        })

    })
  })
})
