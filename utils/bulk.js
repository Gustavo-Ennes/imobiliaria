const Tenant = require("../src/models/Tenant").mongoose
const Owner = require("../src/models/Owner").mongoose
const Property = require("../src/models/Property").mongoose
const Land = require("../src/models/Land").mongoose
const { encrypt } = require('./cyrpt')

const simplePassword = '$2b$10$3b7HoDAlE2Yf58eMlkG.m.XNTORfe/YOv1j/sOkgWHPbVKbhO7d/O'


const randomUsername = () => {
  let string = ''
  const usernames = [
    'colby',
    'sheldon',
    'shadow',
    'monster',
    '2021',
    'xxx',
    'tree',
    'happyday',
    'horrifuck'
  ]
  const namesQtd = 2 + Math.random() * 2
  for(let i = 0; i < namesQtd; i++){
    string += usernames[parseInt(Math.random() * usernames.length)]
  }
  return string.trim()
}

const randomName = () => {

  const firstNames = [
    'Maria',
    'José',
    'Ana',
    'Fernando',
    "Alice",
    'Pedro',
    'Bruno',
    'Sofia',
    'Marta',
    "Elisa"
  ]

  const lastNames = [
    'da Silva',
    'de Souza', 
    'Pereira',
    'Cravoso',
    'Ferroso',
    'Alves',
    'de Paula',
    'Feitosa',
    'Franco',
    'Oliveira'
  ]

  const howManyFirstNames = Math.random() * 3
  const howManyLastNames = Math.random() * 3
  let string = ''
  let aux

  for (let i = 0; i < howManyFirstNames; i++){
    aux = parseInt(Math.random() * firstNames.length)
    string += `${firstNames[aux]} `
  }
  for (let i = 0; i < howManyLastNames; i++){
    aux = parseInt(Math.random() * lastNames.length)
    string += `${lastNames[aux]} `
  }

  return string.trim()
}

const randomPhone = () => {
  const howManyDigits = 8 + Math.random() * 3
  let number, string = '', aux = ''
  for(let i = 0; i < howManyDigits; i++){
    number = Math.random() * 10
    aux = String(number)
    aux = aux.split('.')[0]
    string += aux
  }
  return string.trim()
}



const randomTenantPayload = () => {
  return {
    name: randomName(),
    phone: randomPhone(),
    username: randomUsername(),
    password: simplePassword,
    cellphone: randomPhone(),
    address_street: 'Street 19',
    address_number: 999,
    address_district: "SP",
    address_city: "São Paulo",
    address_zip: "123-2222",
  }
}
const testRandomTenant = () => {

  console.log("TEST RANDOM TENET")
  for(let i = 0 ; i < 5; i++){
    console.log(JSON.stringify(randomTenantPayload(), null, 2))
  }
}

const randomOwnerPayload = () => {
  return randomTenantPayload()
}

const randomLandPayload = () => {
  return {
    ownerId: Math.random() * 1000,
    size: 40 + (Math.random() * 100),
    infrastructure: [],
    address_street: 'Street 19',
    address_number: "999",
    address_district: "SP",
    address_city: "São Paulo",
    address_zip: "123-2222"
  }
}

const randomPropertyPayload = () => {
  return {
    ownerId: Math.random() * 1000,
    bedrooms: parseInt(1 + (Math.random() * 5)),
    bathrooms: parseInt(1 + (Math.random() * 4)),
    parkingSpaces: parseInt(1 + (Math.random() * 3)),
    size: 40 + Math.random() * 100,
    privateSize: 30 + Math.random() * 100,
    characteristics: [],
    infrastructures: [],
    address_street: 'Street 19',
    address_number: 999,
    address_district: "SP",
    address_city: "São Paulo",
    address_zip: "123-2222"
  }
}


const addRandomData = async () => {

  // add a random quantity of all models
  const tenantsQtd = parseInt(Math.random() * 5)
  const ownersQtd = parseInt(Math.random() * 5)
  const landsQtd = parseInt(Math.random() * 5)
  const propertiesQtd = parseInt(Math.random() * 5)
  let aux

  // create them in mongoose
  console.log(`
    creating ${tenantsQtd} tenants, ${ownersQtd} owners, ${landsQtd} lands and ${propertiesQtd} properties for tests 
  `)

  try{

    for(let i = 0; i < tenantsQtd; i++){
      aux = await Tenant.create(randomTenantPayload())
      console.log(`Tenant created: ${aux.name}`)
    }
    for(let i = 0; i < ownersQtd; i++){      
      aux = await Owner.create(randomOwnerPayload())
      console.log(`Owner created: ${aux.name}`)      
    }
    for(let i = 0; i < landsQtd; i++){
      aux = await Land.create(randomLandPayload())  
      console.log(`Land created: ${aux.size} mt2 size`)    
    }
    for(let i = 0; i < propertiesQtd; i++){
      aux = await Property.create(randomPropertyPayload())    
      console.log(`Property created: ${aux.privateSize} mt2 private area`)      
    }
  }catch(err){
    console.log(err)
  }
}

const removeRandomData = async() => {
  console.log("removing random Data created early to tests")
  await Tenant.collection.drop()
  console.log("Tenants droped")
  await Owner.collection.drop()
  console.log("Owners droped")
  await Land.collection.drop()
  console.log("Lands droped")
  await Property.collection.drop()
  console.log("Properties droped")
}


module.exports = {
  addRandomData, 
  removeRandomData, 
  randomTenantPayload,
  randomOwnerPayload,
  randomPropertyPayload,
  randomLandPayload,
  simplePassword
}