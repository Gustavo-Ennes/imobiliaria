const Owner = require("../owners/Owner")
const Property = require("./Property")
const Tenant = require('../tenants/Tenant')
const bulk = require("../utils/bulk")
const request = require('supertest')
const app = require("../config/app")
const chai = require('chai')
const expect = chai.expect
const resolvers = require("../config/resolvers")
const {
  randomOwnerPayload,
  randomPropertyPayload,
  randomTenantPayload
} = require('../utils/bulk')

describe(" >> Properties << ", () =>{

  describe("Unitary\n", () =>{

    describe("~~~~~~~> properties", () => {
      
      it("Should return an array", async() => {
        const properties = await resolvers.properties({input:{}}, {})
        expect(properties).to.be.an('array')
      })

    })
    describe("~~~~~~~> propertyById", () => {
      let id

      before(async() => {
        const owner = await Owner.create(randomOwnerPayload())
        const propertyPayload = randomPropertyPayload()
        propertyPayload.ownerId = owner._id
        const property = await Property.create(propertyPayload)
        id = property._id
      })

      it("Should return a especific property", async() => {
        const p = await resolvers.propertyById({id: id}, {})
        expect(p).to.be.an('object')
      })

      after( async() => {
        await Property.collection.drop()
        await Owner.collection.drop()
      })
    })
    describe("~~~~~~~> property create", () => {

      it("Should not allow a tenant to create a Property", async() => {
        const t = await Tenant.create(randomTenantPayload())
        const pPayload = randomPropertyPayload()
        pPayload.ownerId = t._id
        const res = await resolvers.createProperty({input: pPayload}, {})
        expect(res).to.be.null

      })
      it("Should return the created mongoose model", async() => {
        const o = await Owner.create(randomOwnerPayload())
        const pPayload = randomPropertyPayload()
        pPayload.ownerId = o._id
        const p = await resolvers.createProperty({input: pPayload}, {})
        expect(p).to.be.an("object")
        expect(p).to.have.property("_id")
      })
      after(async()=>{
        await Property.collection.drop()
        await Owner.collection.drop()
      })
    })
    describe("~~~~~~~> property update", () => {
      let alteredAttr, id
      const newSize = 100

      before(async() => {
        const o = await Owner.create(randomOwnerPayload())
        const pPayload = randomPropertyPayload()
        pPayload.ownerId = o._id
        const p = await Property.create(pPayload)
        alteredAttr = p.size
        id = p._id
      })

      it("Should alter a size field to 100", async() => {
        await resolvers.updateProperty({id:id, input:{size: 100}}, {})
        const p = await Property.findOne({_id: id})
        expect(p.size).not.to.equal(alteredAttr)
        expect(p.size).to.equal(newSize)
      })

      after(async() => {
        await Property.collection.drop() 
        await Owner.collection.drop()
      })
    })
    describe("~~~~~~~> delete property", () => {
      let id

      before(async() => {
        const o = await Owner.create(randomOwnerPayload())
        const pPayload = randomPropertyPayload()
        pPayload.ownerId = o._id
        const p = await Property.create(pPayload)
        id = p._id
      })
      it("Should delete a property", async() => {
        await resolvers.deleteProperty({id}, {})
        const p = await Property.findOne({_id:id})
        expect(p).to.equal(null)
      })
      after(async() => {
        await Owner.collection.drop()
      })
    })

  })

  describe("Integration\n", () =>{

    describe('~~~~~~~> read', () => {
      // in this I have to create a Owner to the Land because it's required
      before((done) => {
        const propertyPayload = bulk.randomPropertyPayload()
        const ownerPayload = bulk.randomOwnerPayload()

        Owner.create(ownerPayload).then((owner) => {
          propertyPayload.ownerId = owner._id
          Property.create( propertyPayload ).then(() => {
            done()
          })
          .catch((err)=>console.error(err))
        })
        .catch((err)=>console.error(err))
      })

      it("Should see a property", (done)=>{
        const query = `
          query{
            properties{
              ownerId 
              size
              privateSize
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
            expect(res.body.data).to.have.property('properties')
            expect(res.body.data.properties).to.be.an('array')
            return done();
          })
      })

      after((done) => {
        Property.collection.drop().then(() => {
          Owner.collection.drop().then( () => {
            done()
          })
        })
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

      it("Should add a property", (done) => {
        const query = `
          mutation{
            createProperty(input: {
              ownerId: "${ownerId}",
              bedrooms: ${parseInt(3)},
              bathrooms: ${parseInt(2)},
              parkingSpaces: ${parseInt(1)},
              size: 88.1,
              privateSize: 54.8,
              infrastructures: [],
              characteristics: [],
              address_street: "17 street",
              address_number: ${parseInt(2121)},
              address_district: "SP",
              address_city: "São Paulo",
              address_zip: "11000-000"
            }){
              ownerId
              size
              privateSize
            }
          }
        `
        // MUDEI O NOME PARA MUTATION, NÃO FUNCIONOU
        // VER O QUE HÁ DE ERRADO COM OS TESTES
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
              expect(res.body.data).to.have.property("createProperty")
              expect(res.body.data.createProperty).to.be.an('object')
              done()
            }
          })
      })

      after((done) => {
        Property.collection.drop().then(() => {
          Owner.collection.drop().then(() => {
            done()
          })  
        })
      })
    })
    describe("~~~~~~~> update", () => {
      let id
      before((done) => {
        const ownerPayload = bulk.randomOwnerPayload()
        const propertyPayload = bulk.randomPropertyPayload()

        Owner.create(ownerPayload).then((owner) => {

          id = owner.id
          propertyPayload.ownerId = id
          Property.create(propertyPayload).then((property) => {
            id = property._id
            done()
          })
        })
      })

      it("Should update an existing property", (done) => {

        const query = `
          mutation{
            updateProperty(
              id: "${id}",
              input: {
                privateSize: 666
              }
            ){
              privateSize
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
            expect(res.body.data).to.have.property("updateProperty")
            expect(res.body.data.updateProperty).to.have.property("privateSize")
            expect(res.body.data.updateProperty.privateSize).to.equal(666)
            done()
          }
        })
      })

      after((done) => {
        Property.collection.drop().then(() => {
          Owner.collection.drop().then(() => {
            done()
          })
        })
      })
    })
    describe("~~~~~~~> delete", () => {
      let id
      before(( done ) => {
        const propertyPayload = bulk.randomPropertyPayload()

        Owner.create(bulk.randomOwnerPayload()).then((owner) => {
          id = owner._id
          propertyPayload.ownerId = id
          Property.create( propertyPayload ).then((property) => {
            id = property._id
            done()
          })
        })
      })

      it("Should delete a property", ( done ) => {
        const query = `
          mutation{
            deleteProperty(id: "${id}")
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
            expect(res.body.data.deleteProperty).to.be.a('string')
            done()
          }
        })
        
      })
    })
  })
})