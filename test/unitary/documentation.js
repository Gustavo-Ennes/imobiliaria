const { expect } = require("chai")
const { checkPdf } = require("../../utils/documentation")

describe(" ~ Documentation", () => {
  describe("pdf validation", () => {

    it("Should avoid pdf links without a .pdf extension", async() => {
      const wrongLink = "https://www.falsepdf.com/falsepdf.pdv"
      expect(await checkPdf(wrongLink)).to.equal(undefined)
    })

    it("Should avoid false links", async() => {
      const wrongLink = "httpe://wwv.falsepdf.com/falsepdf.pdf"
      expect(await checkPdf(wrongLink)).to.equal(undefined)
    })

    it("Should avoid a valid link, but with response code 200", async() => {
      const wrongLink = "https://www.pdfgloballinks.uk/wtf.pdf"
      expect(await checkPdf(wrongLink)).to.equal(false)
    })

    it("Should return true with a true link in argument", async() =>{
      const rightLink = "https://fee.org/media/27008/discovering-ayn-rand.pdf"
      expect(await checkPdf(rightLink)).to.equal(true)
    })

  })
})