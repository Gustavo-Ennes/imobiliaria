const mongoose = require('../src/database/db')

console.log(`
--------  REAL ESTATE GRAPHQL API TESTS --------\n\n
  --o> developed by Gustavo Ennes
  --o> https://github.com/Gustavo-Ennes
  --o> https://linkedin.com/in/gustavo-ennes
  --o> https://ennes.dev
  --o> Hail thyself! É o ministério!\n\n
`)

describe("Let's test this out...", () => {

  

  describe(" --- UNIT TESTS --- ", () => {
    require('./unitary/crypt')
    require('./unitary/database')
    require('./unitary/documentation')
    require('./unitary/jsonStringify')
    require('./unitary/resolvers')
    require('./unitary/utils')
  })
  
  describe(" --- INTEGRATION TESTS --- ", () => {
    require('./integration/authentication')
    require('./integration/documentation')
    require('./integration/lands')
    require('./integration/owners')
    require('./integration/properties')
    require('./integration/tenants')
  })

  after(async() => {
    await mongoose.connection.close()
  })
})