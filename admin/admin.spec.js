const { randomAdminPayload } = require("../utils/bulk")
const resolvers = require('../config/resolvers')
const Admin = require("./Admin")
const Owner = require("../owners/Owner")
const bulk = require("../utils/bulk")
const simplePassword = '$2b$10$3b7HoDAlE2Yf58eMlkG.m.XNTORfe/YOv1j/sOkgWHPbVKbhO7d/O'
const request = require('supertest')
const app = require("../config/app")
const chai = require('chai')
const expect = chai.expect

describe(" >> Admins << ", () =>{

  describe("Unitary\n", () => {
    describe("~~~~~~~> admins", () => {
      it("Should return an array", async() => {
        const admins = await resolvers.admins({input:{}}, {})
        expect(admins).to.be.an('array')
      })
    })
    describe("~~~~~~~> adminById", () => {
      let id

      before(async() => {
        const a = await Admin.create(randomAdminPayload())
        id = a._id
      })

      it("Should return a especific admin", async() => {
        const admin = await resolvers.adminById({id: id}, {})
        expect(admin).to.be.an('object')
      })

      after( async() => {
        await Admin.collection.drop()
      })

    })
    describe("~~~~~~~> admin create", () => {
      

      it("Should return the created mongoose model", async() => {

        const a = await resolvers.createAdmin({input: randomAdminPayload()}, {})

        expect(a).to.be.an("object")
        expect(a).to.have.property("_id")
      })
      after(async()=>{
        await Admin.collection.drop()
      })
    })  
    describe("~~~~~~~> admin update", () => {
      let oldUsername, id

      before(async() => {
        const a = await Admin.create(randomAdminPayload())
        oldUsername = a.username
        id = a._id
      })  
      it("Should return a username property changed to 'kratos'", async() => {
        await resolvers.updateAdmin({id:id, input:{username: 'kratos'}}, {})
        const a = await Admin.findOne({_id: id})
        expect(a.username).not.to.equal(oldUsername)
        expect(a.username).to.equal('kratos')
      })
      after(async() => {
        await Admin.collection.drop()
      })
    })
    describe("~~~~~~~> delete admin", () => {
      let id

      before(async() => {
        const a = await Admin.create(randomAdminPayload())
        id = a._id
      })
      it("Should delete a admin", async() => {
        await resolvers.deleteAdmin({id}, {})
        const a = await Admin.findOne({_id:id})
        expect(a).to.equal(null)
      })
    })
  })

  describe("Integration\n", () => {

    describe('~~~~~~~> read', () => {
      before(async() => {
        const payload = bulk.randomAdminPayload()
        aux = payload.name
        await Admin.create( payload )
      })

      it("Should see a admin", async()=>{
        const query = `
          query{
            admins{
              name
            }        
        }`

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)        

        expect(res.body.data).to.have.property('admins')
        expect(res.body.data.admins).to.be.an('array')
      })

      after(async() => {
        await Admin.collection.drop()
      })

    })    
    describe('~~~~~~~> write', () => {

      it("Should add a admin", async() => {
        const query = `
          mutation{
            createAdmin(input:{
              name: "Gustavo Ennes",
              phone: "11 1923316134",
              username: "Kratos",
              password: "${ simplePassword }"
            }){
              name
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
        
          expect(res.body.data).to.have.property("createAdmin")
          expect(res.body.data.createAdmin).to.be.an('object')
        
      })

      after(async() => {
        await Admin.collection.drop()
      })
    })
    describe("~~~~~~~> update", () => {
      let id
      before(async() => {
        const payload = bulk.randomAdminPayload()
        const a = await Admin.create(payload)        
        id = a._id
      })

      it("Should update an existing admin", async() => {

        const query = `
          mutation{
            updateAdmin(
              id: "${id}",
              input: {
                name: "Gustavo Jinikit"
              }
            ){
              name
            }
          }
        `

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
        
          expect(res.body.data).to.have.property("updateAdmin")
          expect(res.body.data.updateAdmin).to.have.property("name")
          expect(res.body.data.updateAdmin.name).to.equal('Gustavo Jinikit')

      })

      after(async () => {
        await Admin.collection.drop()
      })
    })
    describe("~~~~~~~> delete", () => {
      let id
      before(async() => {
        const a = await Admin.create(bulk.randomAdminPayload())
        id = a._id
      })

      it("Should delete a admin", async() => {
        const query = `
          mutation{
            deleteAdmin(id: "${id}")
          }
        `
        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
        
          expect(res.body.data.deleteAdmin).to.be.a('string')
        
      })
    })
  })
})