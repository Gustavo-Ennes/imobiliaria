const bcrypt = require("bcrypt")

module.exports = {  
  passwordMatch: (inserted, original) => {
    const match = bcrypt.compareSync(inserted, original)
    return match
  },
  encrypt: (password) => {
    const hash = bcrypt.hashSync(password, 10)
    return hash
  }
}