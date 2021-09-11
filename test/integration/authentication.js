const { simplePassword } = require("../../utils/crypt")
const Tenant = require("../../src/models/Tenant")
const request = require('supertest')
const app = require("../../app")
const bulk = require('../../utils/bulk')
const chai = require('chai')
const expect = chai.expect

describe("Authentication", () => {

  describe("Sign In", () => {
    it("Should add a user of type tenant", (done) => {

      const query = `
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
          ){
            isSigned
            username
          }
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
            expect(res.body.data.signIn.isSigned).to.equal(true)
            expect(res.body.data.signIn.username).to.not.equal(null)
            done()
          }
        })
    })

    after((done) => {
      Tenant.collection.drop().then(()=>{done()})
    })
  })

  describe("Log In", () => {
    let username, password = '12345'

    before(async() => {
      const payload = bulk.randomTenantPayload()
      username = payload.username
      await Tenant.create(payload)
    })

    it('Should log In', async () => {

      const query = `
        mutation{
          login(username: "${username}", password: "${password}"){
            isLogged
            username
          }
        }
      `

      const res = await request(app)
        .post('/graphql')
        .send({query})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .catch((err)=>console.log(err))    
      
      if(res.body.data.login.sessionRestored){
        console.log(" ~ login from sessionID ~ ")
      }
      expect(res.body.data.login.isLogged).to.equal(true)
      expect(res.body.data.login.username).to.not.equal(null)

    })

    after((done)=>{
      Tenant.collection.drop().then(()=>{done()})
    })
  })


})
