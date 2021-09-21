const { expect } = require('chai')
const bulk = require('./bulk')
const mongoose = require("../database/db")

const tenantOrOwnerTest = (type) => {
  const string = type === "owner" ? "Should match owner payload fields" : "Should match tenant payload fields" 
  return it(string, () => {
    const payload = type === 'owner' ? bulk.randomOwnerPayload() : bulk.randomTenantPayload()
    expect(payload.name).to.be.an('string')
    expect(payload.phone).to.be.an('string')
    expect(payload.username).to.be.an('string')
    expect(payload.password).to.be.an('string')
    expect(payload.cellphone).to.be.an('string')
    expect(payload.address_street).to.be.an('string')
    expect(payload.address_number).to.be.an('number')
    expect(payload.address_city).to.be.an('string')
    expect(payload.address_district).to.be.an('string')
    expect(payload.address_zip).to.be.an('string')

  })
}

describe(" >> Utils << ", (done) => {

  describe("~~~~~~~> bulk", () => {

    tenantOrOwnerTest("owner")
    tenantOrOwnerTest("tenant")

    it("Should match random land payload", () => {
      const p = bulk.randomLandPayload()

      expect(p.ownerId).to.be.an('number')
      expect(p.size).to.be.an('number')
      expect(p.infrastructure).to.be.an('array')
      expect(p.address_street).to.be.an('string')
      expect(p.address_number).to.be.an('number')
      expect(p.address_city).to.be.an('string')
      expect(p.address_district).to.be.an('string')
      expect(p.address_zip).to.be.an('string')

    })

    it("Should match random property payload", () => {
      const p = bulk.randomPropertyPayload()

      expect(p.ownerId).to.be.an('number')
      expect(p.bedrooms).to.be.an('number')
      expect(p.bathrooms).to.be.an('number')
      expect(p.parkingSpaces).to.be.an('number')
      expect(p.privateSize).to.be.an('number')
      expect(p.size).to.be.a('number')
      expect(p.infrastructures).to.be.an('array')
      expect(p.characteristics).to.be.an('array')
      expect(p.address_street).to.be.an('string')
      expect(p.address_number).to.be.an('number')
      expect(p.address_city).to.be.an('string')
      expect(p.address_district).to.be.an('string')
      expect(p.address_zip).to.be.an('string')

    })    
  })

})