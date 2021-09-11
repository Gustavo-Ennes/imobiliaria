const resolvers = require('../../src/resolvers')
const chai = require('chai')
const { randomLandPayload, randomOwnerPayload, randomTenantPayload, randomPropertyPayload } = require('../../utils/bulk')
const expect = chai.expect
const Owner = require("../../src/models/Owner")
const Land = require("../../src/models/Land")
const Property = require("../../src/models/Property")
const Tenant = require('../../src/models/Tenant')
const request = require('supertest')
const app = require('../../app')
const JSONGraphqlStringify = require('../../utils/jsonStringify')
const { assertNonNullType } = require('graphql/type')

describe("> Resolvers", () => {

  // INTIRE
  describe(" ~ lands", () => {
    
    it("Should return an array", async() => {
      const lands = await resolvers.lands({input:{}}, {})
      expect(lands).to.be.an('array')
    })

  })
  describe(" ~ tenants", () => {
    
    it("Should return an array", async() => {
      const tenants = await resolvers.tenants({input:{}}, {})
      expect(tenants).to.be.an('array')
    })

  })
  describe(" ~ owners", () => {
    
    it("Should return an array", async() => {
      const owners = await resolvers.owners({input:{}}, {})
      expect(owners).to.be.an('array')
    })

  })
  describe(" ~ properties", () => {
    
    it("Should return an array", async() => {
      const properties = await resolvers.properties({input:{}}, {})
      expect(properties).to.be.an('array')
    })

  })


  // BY ID
  describe(" ~ landById", () => {
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
  describe(" ~ ownerById", () => {
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
  describe(" ~ tenantById", () => {
    let id

    before(async() => {
      const t = await Tenant.create(randomTenantPayload())
      id = t._id
    })

    it("Should return a especific tenant", async() => {
      const t = await resolvers.tenantsById({id: id}, {})
      expect(t).to.be.an('object')
    })

    after( async() => {
      await Tenant.collection.drop()
    })

  })
  describe(" ~ propertyById", () => {
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

  // CREATION
  describe(" ~ land create", () => {
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
  describe(" ~ owner create", () => {
    it("Should return the created mongoose model", async() => {
      const o = await resolvers.createOwner({input:randomOwnerPayload()}, {})
      expect(o).to.be.an("object")
      expect(o).to.have.property("_id")
    })
    after(async()=>{
      await Owner.collection.drop()
    })
  })
  describe(" ~ tenant create", () => {
    it("Should return the created mongoose model", async() => {
      const t = await resolvers.createTenant({input: randomTenantPayload()}, {})
      expect(t).to.be.an("object")
      expect(t).to.have.property("_id")
    })
    after(async()=>{
      await Tenant.collection.drop()
    })
  })
  describe(" ~ property create", () => {
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

  // UPDATE
  describe(" ~ land update", () => {
    let alteredAttr, id
    const newSize = 100

    before(async() => {
      const o = await Owner.create(randomOwnerPayload())
      const lPayload = randomLandPayload()
      lPayload.ownerId = o._id
      const l = await resolvers.createLand({input: lPayload}, {})
      alteredAttr = l.size
      id = l._id
    })

    it("Should alter a size field to 100", async() => {
      await resolvers.updateLand({id:id, input:{size: 100}}, {})
      const l = await Land.findOne({_id: id})
      expect(l.size).not.to.equal(alteredAttr)
      expect(l.size).to.equal(newSize)
    })

    after(async() => {
      await Land.collection.drop() 
      await Owner.collection.drop()
    })
  })

  describe(" ~ property update", () => {
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

  describe(" ~ tenant update", () => {
    let oldUsername, id

    before(async() => {
      const t = await Tenant.create(randomTenantPayload())
      oldUsername = t.username
      id = t._id
    })  
    it("Should return a username property changed to 'kratos'", async() => {
      await resolvers.updateTenant({id:id, input:{username: 'kratos'}}, {})
      const t = await Tenant.findOne({_id: id})
      expect(t.username).not.to.equal(oldUsername)
      expect(t.username).to.equal('kratos')
    })
    after(async() => {
      await Tenant.collection.drop()
    })
  })
  describe(" ~ owner update", () => {
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

  // DELETE 
  describe(" ~ delete land", () => {
    let id

    before(async() => {
      const o = await Owner.create(randomOwnerPayload())
      const lPayload = randomLandPayload()
      lPayload.ownerId = o._id
      const l = await Land.create(lPayload)
      id = l._id
    })
    it("Should delete a land", async() => {
      await resolvers.deleteLand({id}, {})
      const l = await Land.findOne({_id:id})
      expect(l).to.equal(null)
    })
    after(async() => {
      await Owner.collection.drop()
    })
  })
  describe(" ~ delete property", () => {
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
  describe(" ~ delete tenant", () => {
    let id

    before(async() => {
      const t = await Tenant.create(randomTenantPayload())
      id = t._id
    })
    it("Should delete a tenant", async() => {
      await resolvers.deleteTenant({id}, {})
      const t = await Tenant.findOne({_id:id})
      expect(t).to.equal(null)
    })
  })
  describe(" ~ delete owner", () => {
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

  // AUTH
  describe(" ~ auth", () => {
    describe("signIn", () => {
      let username

      it('Should Sign In', async() => {
        const input = randomOwnerPayload()
        username = input.username
        const type = 'owner'
        const query = `
          mutation{
            signIn(
              type: "${type}",
              input: ${JSONGraphqlStringify(input)}
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
          if(err)console.log(err);
          expect(res.body.data.signIn).to.have.property('username')
          expect(res.body.data.signIn).to.have.property('isSigned')
          expect(res.body.data.signIn.isSigned).to.equals(true)
          expect(res.body.data.signIn.username).to.not.equals(null)
        })
      })

      after(async() => {
        await Owner.collection.drop()
      })
    })

    describe("login", () => {
      
    })

    describe("logout", () => {
      
    })
  })
})
