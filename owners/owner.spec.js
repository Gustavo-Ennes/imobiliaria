const Owner = require('./Owner')
const bulk = require("../utils/bulk")
const simplePassword = '$2b$10$3b7HoDAlE2Yf58eMlkG.m.XNTORfe/YOv1j/sOkgWHPbVKbhO7d/O'
const request = require('supertest')
const app = require("../config/app")
const chai = require('chai')
const expect = chai.expect
const resolvers =  require("../config/resolvers")
const {randomOwnerPayload} = require("../utils/bulk")

describe(" >> Owners << ", () =>{

  describe('Unitary\n', () => {

    describe("~~~~~~~> owners", () => {
      
      it("Should return an array", async() => {
        const owners = await resolvers.owners({input:{}}, {})
        expect(owners).to.be.an('array')
      })

    })
    describe("~~~~~~~> ownerById", () => {
      let id

      before(async() => {
        const owner = await Owner.create(randomOwnerPayload())
        id = owner._id
      })

      it("Should return a especific owner", async() => {
        const o = await resolvers.ownerById({id: id}, {})
        expect(o).to.be.an('object')
      })

      after( async() => {
        await Owner.collection.drop()
      })

    })      
    describe("~~~~~~~> owner create", () => {
      it("Should return the created mongoose model", async() => {
        const o = await resolvers.createOwner({input:randomOwnerPayload()}, {})
        expect(o).to.be.an("object")
        expect(o).to.have.property("_id")
      })
      after(async()=>{
        await Owner.collection.drop()
      })
    })
    describe("~~~~~~~> owner update", () => {
      let oldUsername, id

      before(async() => {
        const o = await Owner.create(randomOwnerPayload())
        oldUsername = o.username
        id = o._id
      })  
      it("Should return a username property changed to 'Rick Sanchez'", async() => {
        await resolvers.updateOwner({id:id, input:{username: 'Rick Sanchez'}}, {})
        const o = await Owner.findOne({_id: id})
        expect(o.username).not.to.equal(oldUsername)
        expect(o.username).to.equal('Rick Sanchez')
      })
      after(async() => {
        await Owner.collection.drop()
      })
    })
    describe("~~~~~~~> delete owner", () => {
      let id

      before(async() => {
        const o = await Owner.create(randomOwnerPayload())
        id = o._id
      })
      it("Should delete a owner", async() => {
        await resolvers.deleteOwner({id}, {})
        const o = await Owner.findOne({_id:id})
        expect(o).to.equal(null)
      })
    })
  })

  describe('Integration\n', () => {

    describe('~~~~~~~> read', () => {
      before((done) => {
        const payload = bulk.randomOwnerPayload()
        aux = payload.name
        Owner.create( payload ).then(()=>{done()})
      })

      it("Should see a owner", (done)=>{
        const query = `
          query{
            owners{
              name
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
            expect(res.body.data).to.have.property('owners')
            expect(res.body.data.owners).to.be.an('array')
            return done();
          })
      })

      after((done) => {
        Owner.collection.drop().then(() => {done()})
      })

    })
    describe('~~~~~~~> write', () => {

      it("Should add a owner", (done) => {
        const query = `
          mutation{
            createOwner(input:{
              name: "Gustavo Ennes",
              phone: "18 1923876134",
              username: "kratos.de.si",
              cellphone: "18 0192384783",
              password: "${ simplePassword }",
              address_street: "17",
              address_number: 212,
              address_district: "SP",
              address_city: "Ilha Solteira",
              address_zip: "15.385-000"
            }){
              name
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
              expect(res.body.data).to.have.property("createOwner")
              expect(res.body.data.createOwner).to.be.an('object')
              done()
            }
          })
      })

      after((done) => {
        Owner.collection.drop().then(() => {done()})
      })
    })
    describe("~~~~~~~> update", () => {
      let id
      before((done) => {
        const payload = bulk.randomOwnerPayload()
        Owner.create(payload).then((owner) => {
          id = owner._id
          done()
        })
      })

      it("Should update an existing owner", (done) => {

        const query = `
          mutation{
            updateOwner(
              id: "${id}",
              input: {
                name: "Gustavo Ennes"
              }
            ){
              name
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
            expect(res.body.data).to.have.property("updateOwner")
            expect(res.body.data.updateOwner).to.have.property("name")
            expect(res.body.data.updateOwner.name).to.equal('Gustavo Ennes')
            done()
          }
        })
      })

      after((done) => {
        Owner.collection.drop().then(() => {
          done()
        })
      })
    })
    describe("~~~~~~~> delete", () => {
      let id
      before(( done ) => {
        Owner.create(bulk.randomOwnerPayload()).then((owner) => {
          id = owner._id
          done()
        })
      })

      it("Should delete a owner", ( done ) => {
        const query = `
          mutation{
            deleteOwner(id: "${id}")
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
            expect(res.body.data.deleteOwner).to.be.a('string')
            done()
          }
        })
        
      })
    })
  })
})