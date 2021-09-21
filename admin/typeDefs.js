module.exports = `

  type Admin{
    name: String
    phone: String
    username: String
    password: String
  }

  input AdminCreateInput{
    name: String!
    phone: String!
    username: String!
    password: String!
  }

  input AdminUpdateInput{
    name: String
    phone: String
    username: String
    password: String
  }

`