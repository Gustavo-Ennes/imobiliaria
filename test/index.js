const mongoose = require('../src/database/db')

console.log(`\n
----------------  REAL ESTATE GRAPHQL API TESTS ----------------
  --o> developed by Gustavo Ennes
  --o> https://github.com/Gustavo-Ennes
  --o> https://linkedin.com/in/gustavo-ennes
  --o> https://ennes.dev
  --o> Hail thyself! É o ministério!
----------------------------------------------------------------\n\n
`)

describe("REAL ESTATE GRAPHQL API TESTS\n\n", () => {


  describe("\n o|-|-|-|o  UNIT TESTS  o|-|-|-|o \n", () => {
    require('./unitary/crypt')
    require('./unitary/database')
    require('./unitary/documentation')
    require('./unitary/jsonStringify')
    require('./unitary/resolvers')
    require('./unitary/utils')
  })
  
  describe("\n o|-|-|-|o  INTEGRATION TESTS  o|-|-|-|o \n", () => {
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