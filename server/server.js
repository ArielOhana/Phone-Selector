const bodyParser = require("body-parser");
const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const port = 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MOGOURL)
  .then(console.log("data base is connected"))
  .catch((erorr) => {
    console.log(erorr);
  });
app.listen(port, () => {
  console.log(`server runs on port ${port}`);
});
