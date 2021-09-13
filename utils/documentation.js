const axios = require("axios")

const isLink = (string) => {
  return string.startsWith("http://") || string.startsWith('https://')
}

const isPdf = (string) => {
  return string.endsWith('.pdf')
}

const linkExists = async(string) => {
  try{
    const res = await axios.get(string)
    const strings = res.data.split('\n')
    return strings[0].indexOf('%PDF') !== -1
  }catch(err){
    console.log(err)
    return false
  }
}

const checkPdf = async(link) => {
  if(isLink(link) && isPdf(link)){
    const exists = await linkExists(link)
    return exists
  }
}


module.exports = {
  checkPdf: checkPdf
}