module.exports = (dict) => {
  const string = JSON.stringify(dict)
  return string.replace(/"(\w+)"(?=:)/, "$1")
}