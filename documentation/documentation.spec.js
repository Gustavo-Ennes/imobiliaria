const { expect } = require("chai")
const { checkPdf } = require("./documentation")
const Tenant = require("../tenants/Tenant")
const Owner = require("../owners/Owner")
const Land = require("../lands/Land")
const Property = require("../properties/Property")
const Admin = require("../admin/Admin")
const resolvers = require('../config/resolvers')

const {
  randomTenantPayload,
  randomOwnerPayload,
  randomLandPayload,
  randomPropertyPayload,
  randomAdminPayload
} = require("../utils/bulk")


describe(" >> Documentation << ", () => {  
  describe("~~~~~~~> pdf validation", () => {

    it("Should avoid pdf links without a .pdf extension", async() => {
      const wrongLink = "https://www.falsepdf.com/falsepdf.pdv"
      expect(await checkPdf(wrongLink)).to.equal(undefined)
    })

    it("Should avoid false links", async() => {
      const wrongLink = "httpe://wwv.falsepdf.com/falsepdf.pdf"
      expect(await checkPdf(wrongLink)).to.equal(undefined)
    })

    it("Should avoid a valid link, but with response code 200", async() => {
      const wrongLink = "https://www.pdfgloballinks.uk/wtf.pdf"
      expect(await checkPdf(wrongLink)).to.equal(false)
    })

    it("Should return true with a true link in argument", async() =>{
      const rightLink = "https://fee.org/media/27008/discovering-ayn-rand.pdf"
      expect(await checkPdf(rightLink)).to.equal(true)
    })

  }) 
  describe("~~~~~~~> documentation adder", () => {

    let tId, oId, lId, pId, tenant, owner, property, land, admin

    before(async() => {
      const tPayload = randomTenantPayload()
      tenant = new Tenant(tPayload)
      const oPayload = randomOwnerPayload()
      owner = new Owner(oPayload)
      const lPayload = randomLandPayload()
      lPayload.ownerId = owner._id
      land = new Land(lPayload)
      const pPayload = randomPropertyPayload()
      pPayload.ownerId = owner._id
      property = new Property(pPayload)

      admin = await Admin.create(randomAdminPayload())

      tId = tenant._id
      oId = owner._id
      lId = land._id
      pId = property._id

      await tenant.save()
      await owner.save()
      await land.save()
      await property.save()
    })

    it("Should add documentation to tenant", async() => {
      const res = await resolvers.addDocumentation(
        {
          link: 'https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf',
          type: 'tenant',
          id: tenant._id
        },  
        {
          username: tenant.username
        }
      )
      tenant = await Tenant.findOne({_id: tId})
      expect(tenant).not.to.be.null
      expect(res).to.have.property("message")
      expect(res).to.have.property("result")
      expect(res.result).to.equal("success")
      expect(tenant.documents).to.have.lengthOf(1)
      expect(tenant.documents[0].status).to.equal('pending')
    })

    it("Should add documentation to a owner", async() => {
      const res = await resolvers.addDocumentation(
        {
          link: 'https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf',
          type: 'owner',
          id: owner._id
        },  
        {
          username: owner.username
        }
      )
      owner = await Owner.findOne({_id: oId})
      expect(owner).not.to.be.null
      expect(res).to.have.property("message")
      expect(res).to.have.property("result")
      expect(res.result).to.equal("success")
      expect(owner.documents).to.have.lengthOf(1)
      expect(owner.documents[0].status).to.equal('pending')
    })

    it("Should add documentation to a land", async() => {
      const res = await resolvers.addDocumentation(
        {
          link: 'https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf',
          type: 'land',
          id: land._id
        },
        {
          username: owner.username
        }
      )
      land = await Land.findOne({_id: lId})
      expect(land).not.to.be.null
      expect(res).to.have.property("message")
      expect(res).to.have.property("result")
      expect(res.result).to.equal("success")
      expect(land.documents).to.have.lengthOf(1)
      expect(land.documents[0].status).to.equal('pending')
    })

    it("Should add documentation to a property", async() => {
      const res = await resolvers.addDocumentation(
        {
          link: 'https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf',
          type: 'property',
          id: property._id
        },
        {
          username: owner.username
        }
      )
      property = await Property.findOne({_id: pId})
      expect(property).not.to.be.null
      expect(res).to.have.property("message")
      expect(res).to.have.property("result")
      expect(res.result).to.equal("success")
      expect(property.documents).to.have.lengthOf(1)
      expect(property.documents[0].status).to.equal('pending')
    })

    after(async() => {
      await Tenant.collection.drop()
      await Owner.collection.drop()
      await Land.collection.drop()
      await Property.collection.drop()
    })
  })
  describe("~~~~~~~> get pending documents", () => {
    let tId, oId, lId, pId, tenant, owner, property, land,
      tCounter = parseInt(1 + Math.random() * 4),
      lCounter = parseInt(1 + Math.random() * 4),
      oCounter = parseInt(1 + Math.random() * 4),
      pCounter = parseInt(1 + Math.random() * 4)

    before(async() => {
      //create one model of each
      const tPayload = randomTenantPayload()
      tenant = new Tenant(tPayload)
      const oPayload = randomOwnerPayload()
      owner = new Owner(oPayload)
      const lPayload = randomLandPayload()
      lPayload.ownerId = owner._id
      land = new Land(lPayload)
      const pPayload = randomPropertyPayload()
      pPayload.ownerId = owner._id
      property = new Property(pPayload)
      admin = await Admin.create(randomAdminPayload())

      tId = tenant._id
      oId = owner._id
      lId = land._id
      pId = property._id

      await tenant.save()
      await owner.save()
      await land.save()
      await property.save()


      // add random number of documents in each
      // tenant
      for(let i = 0; i < tCounter; i++){
        await resolvers.addDocumentation(
          {
            link: 'https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf',
            type: 'tenant',
            id: tenant._id
          },  
          {
            username: tenant.username
          }
        )
      }
      // owner 
      for(let i = 0; i < oCounter; i++){
        await resolvers.addDocumentation(
          {
            link: 'https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf',
            type: 'owner',
            id: owner._id
          },  
          {
            username: owner.username
          }
        )
      }
      // land
      for(let i = 0; i < lCounter; i++){
        await resolvers.addDocumentation(
          {
            link: 'https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf',
            type: 'land',
            id: land._id
          },  
          {
            username: owner.username
          }
        )
      }
      // properties
      for(let i = 0; i < pCounter; i++){
        await resolvers.addDocumentation(
          {
            link: 'https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf',
            type: 'property',
            id: property._id
          },  
          {
            username: admin.username
          }
        )
      }
    })

    it(`tenants should count ${tCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({id:tenant._id, type: 'tenant'}, {username: admin.username})
      expect(res.tenants).to.have.lengthOf(tCounter)
    })
    it(`owners should count ${oCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({id:owner._id, type: 'owner'}, {username:admin.username })
      expect(res.owners).to.have.lengthOf(oCounter)
    })
    it(`lands should count ${lCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({id:land._id, type: 'land'}, {username: admin.username})
      expect(res.lands).to.have.lengthOf(lCounter)
    })
    it(`properties should count ${tCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({id:property._id, type: 'property'}, {username: admin.username})
      expect(res.properties).to.have.lengthOf(pCounter)
    })
    it(`total should count ${tCounter + oCounter + lCounter + pCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({}, {username: admin.username})
      expect(res.total).to.equal(tCounter + oCounter + lCounter + pCounter)
    })

    after(async() => {
      await Tenant.collection.drop()
      await Owner.collection.drop()
      await Land.collection.drop()
      await Property.collection.drop()
    })
  })
})