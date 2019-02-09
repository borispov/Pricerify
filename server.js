const app = require("./src/app");
const mongoose = require('mongoose')
const db = require('./src/config/DB').DB

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('db connected'))
  .catch((err) => console.log('DB did not connect: ', err))

app.listen(process.env.PORT || 3000);

process.on("unhandledRejection", e => {
  console.log(e.message);
  process.exit(1);
});
