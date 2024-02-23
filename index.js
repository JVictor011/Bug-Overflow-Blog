const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//Router
const CategoriesController = require("./categories/CategoriesController");
const ArtidesController = require("./artides/ArtidesController");

app.set("view engine", "ejs");

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

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

app.use("/", CategoriesController);
app.use("/", ArtidesController);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log("Port 3000!");
});