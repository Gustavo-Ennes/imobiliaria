const Tenant = require('../../src/models/Tenant')
const bulk = require("../../utils/bulk")
const app = require('../../app')
const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const simplePassword = bulk.simplePassword


describe("> Tenants", () =>{
  //check by name

  describe(' ~ read', () => {
    before((done) => {
      const payload = bulk.randomTenantPayload()
      aux = payload.name
      Tenant.create( payload ).then(()=>{done()})
    })

    it("Should see a tenant", (done)=>{
      const query = `
        query{
          tenants{
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
          expect(res.body.data).to.have.property('tenants')
          expect(res.body.data.tenants).to.be.an('array')
          return done();
        })
    })

    after((done) => {
      Tenant.collection.drop().then(() => {done()})
    })

  })

  describe(' ~ write', () => {

    it("Should add a tenant", (done) => {
      const query = `
        mutation{
          createTenant(input:{
            name: "Gustavo Ennes",
            phone: "18 1923876134",
            username: "kratos.de.si",
            password: "${ simplePassword }",
            cellphone: "18 0192384783",
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
            expect(res.body.data).to.have.property("createTenant")
            expect(res.body.data.createTenant).to.be.an('object')
            done()
          }
        })
    })

    after((done) => {
      Tenant.collection.drop().then(() => {done()})
    })
  })

  describe(" ~ update", () => {
    let id
    before((done) => {
      const payload = bulk.randomTenantPayload()
      Tenant.create(payload).then((tenant) => {
        id = tenant._id
        done()
      })
    })

    it("Should update an existing tenant", (done) => {

      const query = `
        mutation{
          updateTenant(
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
          expect(res.body.data).to.have.property("updateTenant")
          expect(res.body.data.updateTenant).to.have.property("name")
          expect(res.body.data.updateTenant.name).to.equal('Gustavo Ennes')
          done()
        }
      })
    })

    after((done) => {
      Tenant.collection.drop().then(() => {
        done()
      })
    })
  })

  describe(" ~ delete", () => {
    let id
    before(( done ) => {
      Tenant.create(bulk.randomTenantPayload()).then((tenant) => {
        id = tenant._id
        done()
      })
    })

    it("Should delete a tenant", ( done ) => {
      const query = `
        mutation{
          deleteTenant(id: "${id}")
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
          expect(res.body.data.deleteTenant).to.be.a('string')
          done()
        }
      })
      
    })
  })
})