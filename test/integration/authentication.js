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

    describe("addDocument", () => {
      let query, tUsername, oUsername, tenant, owner, land, property

      before(async() => {
        //create one model of each
        const tPayload = randomTenantPayload()
        tUsername = tPayload.username
        tenant = new Tenant(tPayload)
        const oPayload = randomOwnerPayload()
        oUsername = oPayload.username
        owner = new Owner(oPayload)
        const lPayload = randomLandPayload()
        lPayload.ownerId = owner._id
        land = new Land(lPayload)
        const pPayload = randomPropertyPayload()
        pPayload.ownerId = owner._id
        property = new Property(pPayload)

        await tenant.save()
        await owner.save()
        await land.save()
        await property.save()
      })

      it("Should add document to a tenant", async() => {
        query = `
          mutation{
            login(username: "${tUsername}", password: "12345"){
              isLogged
              sessionUsername
              message
            }
            addDocumentation(
              link: "https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf",
              type: "tenant",
              id: "${tenant._id}"
            ){
              message
              result
            }
          }
        `

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)

        console.log(res.body.data)

        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.addDocumentation).to.have.property('message')
        expect(res.body.data.addDocumentation).to.have.property('result')
        expect(res.body.data.addDocumentation.result).to.equal('success')          
      })
      it("Should add document to a owner", async() => {
        query = `
          mutation{
            login(username: "${oUsername}", password: "12345"){
              isLogged
              sessionUsername
              message
            }
            addDocumentation(
              link: "https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf",
              type: "owner",
              id: "${owner._id}"
            ){
              message
              result
            }
          }
        `

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)

        console.log(res.body.data)

        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.addDocumentation).to.have.property('message')
        expect(res.body.data.addDocumentation).to.have.property('result')
        expect(res.body.data.addDocumentation.result).to.equal('success')          
      })

      it("Should add document to a land", async() => {
        query = `
          mutation{
            login(username: "${oUsername}", password: "12345"){
              isLogged
              sessionUsername
              message
            }
            addDocumentation(
              link: "https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf",
              type: "land",
              id: "${land._id}"
            ){
              message
              result
            }
          }
        `

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)

        console.log(res.body.data)

        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.addDocumentation).to.have.property('message')
        expect(res.body.data.addDocumentation).to.have.property('result')
        expect(res.body.data.addDocumentation.result).to.equal('success')          
      })

      it("Should add document to a property", async() => {
        query = `
          mutation{
            login(username: "${oUsername}", password: "12345"){
              isLogged
              sessionUsername
              message
            }
            addDocumentation(
              link: "https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf",
              type: "property",
              id: "${property._id}"
            ){
              message
              result
            }
          }
        `

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)

        console.log(res.body.data)

        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.addDocumentation).to.have.property('message')
        expect(res.body.data.addDocumentation).to.have.property('result')
        expect(res.body.data.addDocumentation.result).to.equal('success')          
      })
      

      after(async() => {
        await Tenant.collection.drop()
        await Owner.collection.drop()
        await Land.collection.drop()
        await Property.collection.drop()
      })
    })


    describe("session", () => {
      let username
      before(async() => {
        const payload = randomTenantPayload()
        username = payload.username
        await Tenant.create(payload)
      })

      it("Should have a sessionUsername attribute returned", async() => {
        const query = `
          mutation{
            login(username: "${username}", password: "12345"){
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
        
        expect(res.body.data.login.sessionUsername).to.equal(username)
          
      })

      after(async() => {
        await Tenant.collection.drop()
      })
    })

  }catch(err){
    console.log(`TEST ERROR:\n${err}`)
  }

})
