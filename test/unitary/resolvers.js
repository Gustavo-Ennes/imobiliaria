const resolvers = require('../../src/resolvers')
const chai = require('chai')
const { randomLandPayload, randomOwnerPayload, randomTenantPayload, randomPropertyPayload, randomAdminPayload } = require('../../utils/bulk')
const expect = chai.expect
const Owner = require("../../src/models/Owner")
const Land = require("../../src/models/Land")
const Property = require("../../src/models/Property")
const Tenant = require('../../src/models/Tenant')
const Admin = require('../../src/models/Admin')
const request = require('supertest')
const app = require('../../app')
const JSONGraphqlStringify = require('../../utils/jsonStringify')

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

    it("Should not allow a Tenant to create a land", async() => {
      const t = await Tenant.create(randomTenantPayload())
      const lPayload = randomLandPayload()
      lPayload.ownerId = t._id

      const res = await resolvers.createLand({input: lPayload}, {})
      expect(res).to.be.null
    })

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
        let input = randomOwnerPayload(), type = 'owner'
        input.password = '12345'

        const res = await resolvers.signIn({input, type}, {})

        expect(res).to.have.property('isSigned')
        expect(res.isSigned).to.equal(true)

      })

      it("Should sing in a Admin user", async() => {
        let input = randomAdminPayload(), type = 'admin'
        input.password = '12345'

        const res = await resolvers.signIn({input, type}, {})

        expect(res).to.have.property('isSigned')
        expect(res.isSigned).to.equal(true)
      })

      after(async() => {
        await Owner.collection.drop()
        await Admin.collection.drop()
      })
    })

    describe("login", () => {
      let username, admin
      const password = '12345'

      before(async() => {
        const ownerPayload = randomOwnerPayload()
        const owner = await Owner.create(ownerPayload)
        const adminPayload = randomAdminPayload()
        admin = await Admin.create(adminPayload)
        username = owner.username
      })

      it("Should log in", async() => {
        const res = await resolvers.login({username, password}, {request: {session: {}}})
        expect(res.isLogged).to.equal(true)
        expect(res.username).to.equal(username)
        expect(res.sessionUsername).to.equal(username)
      })

      it("Should login a admin user", async() => {
        username = admin.username
        const res = await resolvers.login({username, password}, {request: {session: {}}})
        expect(res.isLogged).to.equal(true)
        expect(res.username).to.equal(username)
        expect(res.sessionUsername).to.equal(username)
      })

      after(async () => {
        await Owner.collection.drop()
        await Admin.collection.drop()
      })
      
    })

    describe("logout", () => {
      let username, admin

      before(async() => {
        const o = await Owner.create(randomOwnerPayload())
        admin = await Admin.create(randomAdminPayload())
        username = o.username
      })

      it("Should logout", async() => {
        const query = `
          mutation{
            login(username: "${username}", password: "12345"){
              isLogged
              username
              sessionUsername
            }
            logout(username: "${username}"){
              isLogged
              sessionUsername
            }
          }
        `
        const res = await request(app)
        .post('/graphql')
        .send({query})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.data.logout).to.have.property("isLogged")
        expect(res.body.data.logout).to.have.property("sessionUsername")
        expect(res.body.data.logout.isLogged).to.equals(false)
        expect(res.body.data.logout.sessionUsername).to.equals(null)

      })

      it('Should logout an Admin user', async() => {
        username = admin.username
        const query = `
          mutation{
            login(username: "${username}", password: "12345"){
              isLogged
              username
              sessionUsername
            }
            logout(username: "${username}"){
              isLogged
              sessionUsername
            }
          }
        `
        const res = await request(app)
        .post('/graphql')
        .send({query})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.body.data.logout).to.have.property("isLogged")
        expect(res.body.data.logout).to.have.property("sessionUsername")
        expect(res.body.data.logout.isLogged).to.equals(false)
        expect(res.body.data.logout.sessionUsername).to.equals(null)
      })

      after(async() => {
        await Owner.collection.drop()
        await Admin.collection.drop()
      })
    })

    describe("documentation adder", () => {
      let tId, oId, lId, pId, tenant, owner, property, land
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
  })

  describe("get pending documents", () => {
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
            username: tenant.username
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
            username: tenant.username
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
            username: tenant.username
          }
        )
      }
    })

    it(`tenants should count ${tCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({id:tenant._id, type: 'tenant'}, {username: 'kratos'})
      expect(res.tenants).to.have.lengthOf(tCounter)
    })
    it(`owners should count ${oCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({id:owner._id, type: 'owner'}, {username: 'kratos'})
      expect(res.owners).to.have.lengthOf(oCounter)
    })
    it(`lands should count ${lCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({id:land._id, type: 'land'}, {username: 'kratos'})
      expect(res.lands).to.have.lengthOf(lCounter)
    })
    it(`properties should count ${tCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({id:property._id, type: 'property'}, {username: 'kratos'})
      expect(res.properties).to.have.lengthOf(pCounter)
    })
    it(`total should count ${tCounter + oCounter + lCounter + pCounter} documents pending`, async() => {
      const res = await resolvers.pendingDocumentation({}, {username: 'kratos'})
      expect(res.total).to.equal(tCounter + oCounter + lCounter + pCounter)
    })
  })


  after(async() => {
    await Tenant.collection.drop()
    await Owner.collection.drop()
    await Land.collection.drop()
    await Property.collection.drop()
  })
})
