module.exports = [
  require('./models/Land').typeDef,
  require('./models/Property').typeDef,
  require('./models/Owner').typeDef,
  require('./models/Tenant').typeDef,
  require('./inputs'),
  require('./models/Query')
]