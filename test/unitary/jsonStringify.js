const { expect } = require('chai')
const stringify = require('../../utils/jsonStringify')

describe(" >> jsonStringify << ", () => {
  it("Should remove quotes from the keys of a stringified json",() => {
    const json = {
      "key1": "value1",
      "key2": "value2",
      "key3": "value3",
      "key4": 7,
      "key5": null,
      "favFriends": ["Kolade", "Nithya", "Dammy", "Jack"],
      "favPlayers": {"one": "Kante", "two": "Hazard", "three": "Didier"}
    }
    const stringifiedJson = stringify(json)
    
    expect(stringifiedJson.indexOf('"key1"')).to.equal(-1)
    expect(stringifiedJson.indexOf('key1')).to.not.equal(-1)
    expect(stringifiedJson.indexOf('"favPlayers"')).to.equal(-1)
    expect(stringifiedJson.indexOf('favPlayers')).to.not.equal(-1)
    expect(stringifiedJson.indexOf('"three"')).to.equal(-1)
    expect(stringifiedJson.indexOf('three')).to.not.equal(-1)

  })
})