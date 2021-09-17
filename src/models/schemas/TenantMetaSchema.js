module.exports = new Mongoose.Schema({
  // visits array
  visits: [{
    // the id of a tenant or land visualized
    id: String,
    // the type, property or tenant
    type: String,
    // the time spent viewing this product
    timeInMinutes: Number
  }],
  logins: [{
    loginDate: Date,
    logoutData: Date
  }],
  likes: [String]
})

// observe this when doing listeners in vue
 