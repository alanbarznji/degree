const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "63fd6c5e",
  apiSecret: "ikyRelWXfmjaI6Bj"
})
module.exports = vonage;