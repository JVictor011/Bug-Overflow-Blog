const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

app.set("view engine", "ejs");

app.use(express.static("public"));

//Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((erro) => {
    console.log(erro);
  });

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Port 3000!");
});
