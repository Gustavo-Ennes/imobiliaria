const { getRounds } = require("bcrypt")
const { expect } = require("chai")
const { encrypt, passwordMatch } = require("./crypt")

describe(" >> Encryption << ", () => {

  let password = 'kratos'

  describe("~~~~~~~> passwordMatch", () => {

    it("Should create a hash that matches 'kratos' string", () => {
      const enc = encrypt(password)
      expect(passwordMatch(password, enc))
    })
  })

  describe("~~~~~~~> encrypt", () => {
    it("Should get the number of rounds of a given hash", () => {
      const realRounds = 10
      const enc = encrypt(password)
      expect(getRounds(enc)).to.equal(realRounds)
    })
  })
})