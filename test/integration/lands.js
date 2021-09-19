const Land = require('../../src/models/Land')
const Owner = require('../../src/models/Owner')
const bulk = require("../../utils/bulk")
const app = require('../../app')
const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const {randomOwnerPayload} = require('../../utils/bulk')


describe(" >> Lands << ", () =>{
  //check by name

  describe('~~~~~~~> read', () => {
    // in this I have to create a Owner to the Land because it's required
    before((done) => {
      try{
        const landPayload = bulk.randomLandPayload()
        const ownerPayload = bulk.randomOwnerPayload()

        Owner.create(ownerPayload)
        .catch((err) => console.log(err))
        .then((owner) => {
          
          landPayload.ownerId = owner._id
          Land.create( landPayload ).then((land) => {
            done()
          })
        })
      }catch(err){
        console.log(err)
      }
    })

    it("Should see a land", (done)=>{
      const query = `
        {
          lands{
            ownerId
          }        
        }`

      request(app)
        .post('/graphql')
        .send({query})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err){
            console.log(err)
            return done(err)
          }
          expect(res.body.data).to.have.property('lands')
          expect(res.body.data.lands).to.be.an('array')
          return done();
        })
    })

    after(async() => {
      await Land.collection.drop()
      await Owner.collection.drop()
    })

  })

  describe('~~~~~~~> write', () => {
    let ownerId
    // adding the owner requisite
    before((done) => {
      const ownerPayload = bulk.randomOwnerPayload()
      Owner.create( ownerPayload ).then((owner) => {
        ownerId = owner._id
        done()
      })
    })

    it("Should add a land", (done) => {
      const query = `
        mutation{
          createLand(input:{
            ownerId: "${ownerId}",
            size: 54.6,
            infrastructures: [],
            address_street: "17 street",
            address_number: 2121,
            address_district: "SP",
            address_city: "São Paulo",
            address_zip: "11000-000"
          }){
            ownerId
            size
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
            expect(res.body.data).to.have.property("createLand")
            expect(res.body.data.createLand).to.be.an('object')
            done()
          }
        })
    })

    after((done) => {
      Land.collection.drop().then(() => {
        Owner.collection.drop().then(() => {
          done()
        })  
      })
    })
  })

  describe("~~~~~~~> update", () => {
    let id, realOwner
    before((done) => {
      const ownerPayload = bulk.randomOwnerPayload()
      const landPayload = bulk.randomLandPayload()

      Owner.create(ownerPayload).then((owner) => {
        realOwner = owner
        id = owner._id
        landPayload.ownerId = id
        Land.create(landPayload).then((land) => {
          id = land._id
          done()
        })
      })
    })

    it("Should not update a land that dont belog to an Owner", async() => {
      const fakeOwner = await Owner.create(bulk.randomOwnerPayload())
      const query = `
        mutation{
          login(username: "${fakeOwner.username}", password:"12345"){
            isLogged
          }
          updateLand(
            id: "${id}",
            input: {
              size: 666
            }
          ){
            size
          }
        }
      `

      const res = await request(app)
        .post('/graphql')
        .send({query})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.data.login.isLogged).to.be.true
      expect(res.body.data).to.have.property("updateLand")
      expect(res.body.data.updateLand).to.be.null
      

    })

    it("Should update an existing land", (done) => {

      const query = `
        mutation{
          login(username: "${realOwner.username}", password: "12345"){
            isLogged
          }
          updateLand(
            id: "${id}",
            input: {
              size: 666
            }
          ){
            size
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
        if(err){done(err)}
        else {
          expect(res.body.data.login.isLogged).to.be.true
          expect(res.body.data).to.have.property("updateLand")
          expect(res.body.data.updateLand).to.have.property("size")
          expect(res.body.data.updateLand.size).to.equal(666)
          done()
        }
      })
    })

    after((done) => {
      Land.collection.drop().then(() => {
        Owner.collection.drop().then(() => {
          done()
        })
      })
    })
  })

  describe("~~~~~~~> delete", () => {
    let id, username
    before(( done ) => {
      const landPayload = bulk.randomLandPayload()

      Owner.create(bulk.randomOwnerPayload()).then((owner) => {
        id = owner._id
        username = owner.username
        landPayload.ownerId = id
        Land.create( landPayload ).then((land) => {
          id = land._id
          done()
        })
      })
    })

    it("Should not delete a land if user isn't it's owner", async() => {
      const fakeOwner = await Owner.create(randomOwnerPayload())
      const query = `
        mutation{
          login(username:"${fakeOwner.username}", password: "12345"){
            isLogged
          }
          deleteLand(id: "${id}")
        }
      `
      const res = await request(app)
        .post('/graphql')
        .send({query})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.data.deleteLand).to.be.a("string")
      expect(res.body.data.deleteLand).to.be.equal('fail')


    })

    it("Should delete a land", ( done ) => {
      const query = `
        mutation{
          login(username: "${username}", password: "12345"){
            isLogged
          }
          deleteLand(id: "${id}")
        }
      `
      request(app)
        .post('/graphql')
        .send({query})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if(err){done(err)}
          else{
            expect(res.body.data.deleteLand).to.be.a('string')
            expect(res.body.data.deleteLand).not.to.equal('fail')
            done()
          }
        })
      
    })
  })
})