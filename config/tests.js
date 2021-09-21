const mongoose = require('../database/db')

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

  require('../database/db.spec')
  require('../auth/auth.spec')
  require("../admin/admin.spec")
  require("../lands/land.spec")
  require("../owners/owner.spec")
  require("../properties/property.spec")
  require("../tenants/tenant.spec")
  require("../documentation/documentation.spec")
  require("../utils/bulk.spec")
  require("../utils/crypt.spec")
  require("../utils/jsonStringify.spec")



  after(async() => {
    await mongoose.connection.close()
  })
})
