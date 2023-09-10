const mongoose = require('mongoose')
const db = () => {
    mongoose
      .connect(process.env.DB_URL, {
        useNewUrlParser: true, // <-- no longer necessary
        useUnifiedTopology: true, // <-- no longer necessary
      })
      .then((con) => {
        console.log(`is conected :${con.connection.host}`);
      })
      .catch((error) => console.log("error:", error));
}
module.exports =db