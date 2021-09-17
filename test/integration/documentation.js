const { expect } = require("chai")
const request = require("supertest")
const Tenant = require('../../src/models/Tenant')
const Owner = require('../../src/models/Owner')
const Land = require('../../src/models/Land')
const Property = require('../../src/models/Property')
const app = require('../../app')
const {
  randomTenantPayload,
  randomPropertyPayload,
  randomLandPayload,
  randomOwnerPayload
} = require('../../utils/bulk')

describe(" ~ Documentation", () => {
  try{

    describe("add a document", () => {
      let query, tUsername, oUsername, tenant, owner, land, property

      before(async() => {
        //create one model of each
        const tPayload = randomTenantPayload()
        tUsername = tPayload.username
        tenant = new Tenant(tPayload)
        const oPayload = randomOwnerPayload()
        oUsername = oPayload.username
        owner = new Owner(oPayload)
        const lPayload = randomLandPayload()
        lPayload.ownerId = owner._id
        land = new Land(lPayload)
        const pPayload = randomPropertyPayload()
        pPayload.ownerId = owner._id
        property = new Property(pPayload)

        await tenant.save()
        await owner.save()
        await land.save()
        await property.save()
      })

      it("Should add document to a tenant", async() => {
        query = `
          mutation{
            login(username: "${tUsername}", password: "12345"){
              isLogged
              sessionUsername
              message
            }
            addDocumentation(
              link: "https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf",
              type: "tenant",
              id: "${tenant._id}"
            ){
              message
              result
            }
          }
        `

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)


        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.addDocumentation).to.have.property('message')
        expect(res.body.data.addDocumentation).to.have.property('result')
        expect(res.body.data.addDocumentation.result).to.equal('success')          
      })
      it("Should add document to a owner", async() => {
        query = `
          mutation{
            login(username: "${oUsername}", password: "12345"){
              isLogged
              sessionUsername
              message
            }
            addDocumentation(
              link: "https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf",
              type: "owner",
              id: "${owner._id}"
            ){
              message
              result
            }
          }
        `

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)

        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.addDocumentation).to.have.property('message')
        expect(res.body.data.addDocumentation).to.have.property('result')
        expect(res.body.data.addDocumentation.result).to.equal('success')          
      })

      it("Should add document to a land", async() => {
        query = `
          mutation{
            login(username: "${oUsername}", password: "12345"){
              isLogged
              sessionUsername
              message
            }
            addDocumentation(
              link: "https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf",
              type: "land",
              id: "${land._id}"
            ){
              message
              result
            }
          }
        `

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)


        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.addDocumentation).to.have.property('message')
        expect(res.body.data.addDocumentation).to.have.property('result')
        expect(res.body.data.addDocumentation.result).to.equal('success')          
      })
      

      it("Should add document to a property", async() => {
        query = `
          mutation{
            login(username: "${oUsername}", password: "12345"){
              isLogged
              sessionUsername
              message
            }
            addDocumentation(
              link: "https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf",
              type: "property",
              id: "${property._id}"
            ){
              message
              result
            }
          }
        `

        const res = await request(app)
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)


        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.addDocumentation).to.have.property('message')
        expect(res.body.data.addDocumentation).to.have.property('result')
        expect(res.body.data.addDocumentation.result).to.equal('success')          
      })
      

      after(async() => {
        await Tenant.collection.drop()
        await Owner.collection.drop()
        await Land.collection.drop()
        await Property.collection.drop()
      })
    })

    describe("get pending documents", () => {

      let tenant, owner, property, land, type, obj
      const doc = {
        link: "https://kidsspark.weebly.com/uploads/5/0/6/5/50658543/harry_potter_annd_the_sorcerers_stone.pdf",
        status: 'pending',
        uploadDate: new Date()
      }

      before(async() => {
        const tPayload = randomTenantPayload()
        tenant = new Tenant(tPayload)
        tenant.documents.push(doc)
        const oPayload = randomOwnerPayload()
        owner = new Owner(oPayload)
        owner.documents.push(doc)
        const lPayload = randomLandPayload()
        lPayload.ownerId = owner._id
        land = new Land(lPayload)
        land.documents.push(doc)
        const pPayload = randomPropertyPayload()
        pPayload.ownerId = owner._id
        property = new Property(pPayload)
        property.documents.push(doc)

        await tenant.save()
        await owner.save()
        await land.save()
        await property.save()

      })


      it(`Should get pending documentation from tenants`, async() => {
        const query = `
        mutation{
          login(username: "${tenant.username}", password: "12345"){
            isLogged
          }
          pendingDocumentation(id: "${tenant._id}", type: "tenant"){     
            tenants{
              id
              name
            }       
            total
            status
            message
          }
        }
        `
        const res = await request(app) 
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)


        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.pendingDocumentation.tenants).to.have.lengthOf(1)
        expect(res.body.data.pendingDocumentation.total).to.equal(1)
        expect(res.body.data.pendingDocumentation.status).to.equal('success')

      })

      it(`Should get pending documentation from owners`, async() => {
        const query = `
        mutation{
          login(username: "${tenant.username}", password: "12345"){
            isLogged
          }
          pendingDocumentation(id: "${owner._id}", type: "owner"){     
            owners{
              id
              name
            }       
            total
            status
            message
          }
        }
        `
        const res = await request(app) 
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)

        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.pendingDocumentation.owners).to.have.lengthOf(1)
        expect(res.body.data.pendingDocumentation.total).to.equal(1)
        expect(res.body.data.pendingDocumentation.status).to.equal('success')

      })

      it(`Should get pending documentation from lands`, async() => {
        const query = `
        mutation{
          login(username: "${tenant.username}", password: "12345"){
            isLogged
          }
          pendingDocumentation(id: "${land._id}", type: "land"){     
            lands{
              id
            }       
            total
            status
            message
          }
        }
        `
        const res = await request(app) 
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)

        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.pendingDocumentation.lands).to.have.lengthOf(1)
        expect(res.body.data.pendingDocumentation.total).to.equal(1)
        expect(res.body.data.pendingDocumentation.status).to.equal('success')

      })

      it(`Should get pending documentation from properties`, async() => {
        const query = `
        mutation{
          login(username: "${tenant.username}", password: "12345"){
            isLogged
          }
          pendingDocumentation(id: "${property._id}", type: "property"){     
            properties{
              id
            }       
            total
            status
            message
          }
        }
        `
        const res = await request(app) 
          .post('/graphql')
          .send({query})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)

        expect(res.body.data.login.isLogged).to.be.true
        expect(res.body.data.pendingDocumentation.properties).to.have.lengthOf(1)
        expect(res.body.data.pendingDocumentation.total).to.equal(1)
        expect(res.body.data.pendingDocumentation.status).to.equal('success')

      })

      after(async() => {
        await Tenant.collection.drop()
        await Owner.collection.drop()
        await Land.collection.drop()
        await Property.collection.drop()
      })
      

    })
  

  }catch(err){
    console.log(err)
  }

})
