const { simplePassword } = require("../utils/crypt")
const Tenant = require("../tenants/Tenant")
const Owner = require("../owners/Owner")
const request = require('supertest')
const app = require("../config/app")
const bulk = require('../utils/bulk')
const chai = require('chai')
const expect = chai.expect
const {randomOwnerPayload, randomAdminPayload, randomTenantPayload} = require('../utils/bulk')
const Admin = require("../admin/Admin")
const resolvers = require("../config/resolvers")

describe(" >> Authentication << ", () => {

  describe("Unitary\n", () => {

    describe("~~~~~~~> signIn", () => {
      let username

      it('Should Sign In', async() => {
        let input = randomOwnerPayload(), type = 'owner'
        input.password = '12345'

        const res = await resolvers.signIn({input, type}, {})

        expect(res).to.have.property('isSigned')
        expect(res.isSigned).to.equal(true)

      })

      it("Should sing in a Admin user", async() => {
        let input = randomAdminPayload(), type = 'admin'
        input.password = '12345'

        const res = await resolvers.signIn({input, type}, {})

        expect(res).to.have.property('isSigned')
        expect(res.isSigned).to.equal(true)
      })

      after(async() => {
        await Owner.collection.drop()
        await Admin.collection.drop()
      })
    })
  
    describe("~~~~~~~> login", () => {
      let username, admin
      const password = '12345'

      before(async() => {
        const ownerPayload = randomOwnerPayload()
        const owner = await Owner.create(ownerPayload)
        const adminPayload = randomAdminPayload()
        admin = await Admin.create(adminPayload)
        username = owner.username
      })

      it("Should log in", async() => {
        const res = await resolvers.login({username, password}, {request: {session: {}}})
        expect(res.isLogged).to.equal(true)
        expect(res.username).to.equal(username)
        expect(res.sessionUsername).to.equal(username)
      })

      it("Should login a admin user", async() => {
        username = admin.username
        const res = await resolvers.login({username, password}, {request: {session: {}}})
        expect(res.isLogged).to.equal(true)
        expect(res.username).to.equal(username)
        expect(res.sessionUsername).to.equal(username)
      })

      after(async () => {
        await Owner.collection.drop()
        await Admin.collection.drop()
      })
      
    })
  
    describe("~~~~~~~> logout", () => {
      let username, admin

      before(async() => {
        const o = await Owner.create(randomOwnerPayload())
        admin = await Admin.create(randomAdminPayload())
        username = o.username
      })

      it("Should logout", async() => {
        const query = `
          mutation{
            login(username: "${username}", password: "12345"){
              isLogged
              username
              sessionUsername
            }
            logout(username: "${username}"){
              isLogged
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

        expect(res.body.data.logout).to.have.property("isLogged")
        expect(res.body.data.logout).to.have.property("sessionUsername")
        expect(res.body.data.logout.isLogged).to.equals(false)
        expect(res.body.data.logout.sessionUsername).to.equals(null)

      })

      it('Should logout an Admin user', async() => {
        username = admin.username
        const query = `
          mutation{
            login(username: "${username}", password: "12345"){
              isLogged
              username
              sessionUsername
            }
            logout(username: "${username}"){
              isLogged
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

        expect(res.body.data.logout).to.have.property("isLogged")
        expect(res.body.data.logout).to.have.property("sessionUsername")
        expect(res.body.data.logout.isLogged).to.equals(false)
        expect(res.body.data.logout.sessionUsername).to.equals(null)
      })

      after(async() => {
        await Owner.collection.drop()
        await Admin.collection.drop()
      })
    })
  })

  describe("Integration\n", () => {

    try{

      describe("~~~~~~~> Sign In", () => {
        it("Should add a user of type Admin", async()=> {
          const query = `
            mutation{
              signIn(
                type: "admin",
                input:{
                  name: "Gustavo Ennes",
                  password: "${simplePassword}"
                  phone: "18 1913856134",
                  username: "kratosKhan",
                  cellphone: "18 0294384783",
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
          const res = await request(app)
            .post('/graphql')
            .send({query})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
  
            expect(res.body.data.signIn.isSigned).to.equal(true)
            expect(res.body.data.signIn.username).to.equal("kratosKhan")
              
        })
  
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
  
        after(async() => {
          await Tenant.collection.drop()
          await Admin.collection.drop()
        })
      })
  
      describe("~~~~~~~> Log In", () => {
        let username, password = '12345', admin
  
        before(async() => {
          const payload = bulk.randomTenantPayload()
          username = payload.username
          await Tenant.create(payload)
          admin = await Admin.create(bulk.randomAdminPayload())
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
            
          
          if(res.body.data.login.sessionRestored){
            console.log(" ~ login from sessionID ~ ")
          }
  
          expect(res.body.data.login.isLogged).to.equal(true)
          expect(res.body.data.login.username).to.not.equal(null)
          expect(res.body.data.login.sessionUsername).to.equal(username)
  
        })
  
        it("Should log in an Admin", async() => {
          username = admin.username
  
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
  
          expect(res.body.data.login.isLogged).to.equal(true)
          expect(res.body.data.login.username).to.not.equal(null)
          expect(res.body.data.login.sessionUsername).to.equal(username)
            
          
        })
  
        after(async()=>{
          await Tenant.collection.drop()
          await Admin.collection.drop()
        })
      })
  
      describe("~~~~~~~> session check", () => {
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


})