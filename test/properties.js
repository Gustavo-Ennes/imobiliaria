const Property = require("../src/models/Property").mongoose
const Owner = require("../src/models/Owner").mongoose
const bulk = require("../utils/bulk")
const app = require('../app')
const request = require('supertest')
const {gql} = require('graphql-tag')
const chai = require('chai')
const expect = chai.expect

module.exports = describe("> Properties", () =>{
  //check by name

  describe(' ~ read', () => {
    // in this I have to create a Owner to the Land because it's required
    before((done) => {
      const propertyPayload = bulk.randomPropertyPayload()
      const ownerPayload = bulk.randomOwnerPayload()

      Owner.create(ownerPayload).then((owner) => {
        propertyPayload.ownerId = owner._id
        Property.create( propertyPayload ).then(() => {
          done()
        })
      })
    })

    it("Should see a property", (done)=>{
      const query = gql`
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
          console.log(`The properties: ${JSON.stringify(res.body.data.properties, 2, null)}`)
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

  describe(' ~ write', () => {
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
      const query = gql`
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

  describe(" ~ update", () => {
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

      const query = gql`
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

  describe(" ~ delete", () => {
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
      const query = gql`
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