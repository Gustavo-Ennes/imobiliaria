const Owner = require('../../src/models/Owner')
const bulk = require("../../utils/bulk")
const app = require('../../app')
const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const { simplePassword } = require("../../utils/bulk")

describe(" >> Owners << ", () =>{
  //check by name

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