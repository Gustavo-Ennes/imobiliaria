const { simplePassword } = require("../../utils/crypt")
const Tenant = require("../../src/models/Tenant")
const Owner = require("../../src/models/Owner")
const Land = require("../../src/models/Land")
const Property = require("../../src/models/Property")
const request = require('supertest')
const app = require("../../app")
const bulk = require('../../utils/bulk')
const chai = require('chai')
const expect = chai.expect
const {randomOwnerPayload, randomTenantPayload, randomPropertyPayload, randomLandPayload} = require('../../utils/bulk')

describe("Authentication", () => {

  try{

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
              sessionRestored
              sessionUsername
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
          
        console.log(JSON.stringify(res.body.data))
        
        if(res.body.data.login.sessionRestored){
          console.log(" ~ login from sessionID ~ ")
        }

        expect(res.body.data.login.isLogged).to.equal(true)
        expect(res.body.data.login.username).to.not.equal(null)
        expect(res.body.data.login.sessionUsername).to.equal(username)

      })

      after((done)=>{
        Tenant.collection.drop().then(()=>{done()})
      })
    })

    describe("session check", () => {
      let username

      before(async() => {
        const o = await Owner.create(randomOwnerPayload())
        username = o.username
      })

      it("Should return a session attr in response", async() => {
        const query = `
          mutation{
            login(username: "${username}", password: "12345"){
              isLogged
              username
              sessionUsername
            }
          }
        `
        const res = await request(app)
        .post('/graphql')
        .send({query})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        
        expect(res.body.data.login.username).to.equal(username)
        expect(res.body.data.login.isLogged).to.equal(true)
        expect(res.body.data.login.sessionUsername).to.equal(username)
      })

      after(async() => {
        await Owner.collection.drop()
      })

    })



  }catch(err){
    console.log(`TEST ERROR:\n${err}`)
  }

})
