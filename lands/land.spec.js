const Land = require('./Land')
const Owner = require('../owners/Owner')
const Tenant = require('../tenants/Tenant')
const bulk = require("../utils/bulk")
const app = require('../config/app')
const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const resolvers = require('../config/resolvers')
const {randomOwnerPayload, randomLandPayload, randomTenantPayload} = require('../utils/bulk')


describe(" >> Lands << ", () =>{
  

  describe("Unitary\n", () => {

    describe("~~~~~~~> lands", () => {
    
      it("Should return an array", async() => {
        const lands = await resolvers.lands({input:{}}, {})
        expect(lands).to.be.an('array')
      })  
    })
    describe("~~~~~~~> landById", () => {
      let id

      before(async() => {
        const owner = await Owner.create(randomOwnerPayload())
        const landPayload = randomLandPayload()
        landPayload.ownerId = owner._id
        const land = await Land.create(landPayload)
        id = land._id
      })

      it("Should return a especific land", async() => {
        const land = await resolvers.landById({id: id}, {})
        expect(land).to.be.an('object')
      })

      after( async() => {
        await Land.collection.drop()
        await Owner.collection.drop()
      })

    })
    describe("~~~~~~~> land create", () => {

      it("Should not allow a Tenant to create a land", async() => {
        const t = await Tenant.create(randomTenantPayload())
        const lPayload = randomLandPayload()
        lPayload.ownerId = t._id

        const res = await resolvers.createLand({input: lPayload}, {})
        expect(res).to.be.null
      })

      it("Should return the created mongoose model", async() => {
        const o = await Owner.create(randomOwnerPayload())
        const lPayload = randomLandPayload()
        lPayload.ownerId = o._id
        
        const l = await resolvers.createLand({input: lPayload}, {})

        expect(l).to.be.an("object")
        expect(l).to.have.property("_id")
      })
      after(async()=>{
        await Land.collection.drop()
        await Owner.collection.drop()
      })
    }) 
    describe("~~~~~~~> land update", () => {
      let alteredAttr, id, o
      const newSize = 100

      before(async() => {
        o = await Owner.create(randomOwnerPayload())
        const lPayload = randomLandPayload()
        lPayload.ownerId = o._id
        const l = await resolvers.createLand({input: lPayload}, {username: o.username})
        alteredAttr = l.size
        id = l._id
      })

      it("Should alter a size field to 100", async() => {
        await resolvers.updateLand({id:id, input:{size: 100}}, {username: o.username})
        const l = await Land.findOne({_id: id})
        expect(l.size).not.to.equal(alteredAttr)
        expect(l.size).to.equal(newSize)
      })

      after(async() => {
        await Land.collection.drop() 
        await Owner.collection.drop()
      })
    })
    describe("~~~~~~~> delete land", () => {
      let id, o

      before(async() => {
        o = await Owner.create(randomOwnerPayload())
        const lPayload = randomLandPayload()
        lPayload.ownerId = o._id
        const l = await Land.create(lPayload)
        id = l._id
      })
      it("Should delete a land", async() => {
        await resolvers.deleteLand({id}, {username: o.username})
        const l = await Land.findOne({_id:id})
        expect(l).to.equal(null)
      })
      after(async() => {
        await Owner.collection.drop()
      })
    })

  })


  describe("Integration\n", () => {
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

})