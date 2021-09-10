const resolvers = require('../../src/resolvers')
const chai = require('chai')
const { randomLandPayload, randomOwnerPayload, randomTenantPayload, randomPropertyPayload } = require('../../utils/bulk')
const expect = chai.expect
const Owner = require("../../src/models/Owner")
const Land = require("../../src/models/Land")
const Property = require("../../src/models/Property")
const Tenant = require('../../src/models/Tenant')

describe("> Resolvers", () => {

  describe(" ~ lands", () => {
    
    it("Should return an array", async() => {
      const lands = await resolvers.lands({}, {})
      expect(lands).to.be.an('array')
    })

  })
  describe(" ~ tenants", () => {
    
    it("Should return an array", async() => {
      const tenants = await resolvers.tenants({}, {})
      expect(tenants).to.be.an('array')
    })

  })
  describe(" ~ owners", () => {
    
    it("Should return an array", async() => {
      const owners = await resolvers.owners({}, {})
      expect(owners).to.be.an('array')
    })

  })
  describe(" ~ properties", () => {
    
    it("Should return an array", async() => {
      const properties = await resolvers.properties({}, {})
      expect(properties).to.be.an('array')
    })

  })

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

})