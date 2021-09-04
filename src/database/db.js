const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = `
mongodb+srv://kratos:${process.env.DB_PASS}@cluster0.fhhom.mongodb.net?retryWrites=true&w=majority
`
module.exports = new MongoClient(uri)