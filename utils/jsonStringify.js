module.exports = (dict) => {
  const string = JSON.stringify(dict)
  return string.replace(/"(\w+)"(?=:)/g, "$1")
}