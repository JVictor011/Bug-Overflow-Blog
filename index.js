const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const optionsFormar = require("./utils/optionsFormar");
const session = require("express-session");

const Articles = require("./artides/Articles");
const Category = require("./categories/Category");
const User = require("./user/User");

//Router
const CategoriesController = require("./categories/CategoriesController");
const ArtidesController = require("./artides/ArtidesController");
const UserController = require("./user/UserController");

app.set("view engine", "ejs");

//Session
app.use(
  session({
    secret: "ihnahgadf4988#$dfdT_",
    cookie: { maxAge: 60000 },
  })
);

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
app.use("/", UserController);

app.get("/", async (req, res) => {
  try {
    const articles = await Articles.findAll({
      order: [["id", "DESC"]],
      limit: 4,
      include: [{ model: Category }],
    });

    const categoris = await Category.findAll();

    if (!articles) {
      res.status(500).send("Erro ao recuperar artigos");
    }
    if (!categoris) {
      res.status(500).send("Erro ao recuperar categorias");
    }

    res.render("index", {
      articles: articles,
      optionsFormar: optionsFormar,
      categoris: categoris,
      userAuth: req.session.user,
    });
  } catch (erro) {
    res.status(500).send("Erro ao recuperar artigos");
  }
});

app.get("/:slug", async (req, res) => {
  try {
    var slug = req.params.slug;
    const article = await Articles.findOne({
      where: {
        slug: slug,
      },
    });

    const categoris = await Category.findAll();

    if (article != undefined && categoris != undefined) {
      res.render("article", {
        article: article,
        optionsFormar: optionsFormar,
        categoris: categoris,
      });
    } else {
      res.redirect("/");
    }
  } catch (erro) {
    res.status(500).send("Erro ao recuperar artigos");
  }
});

app.get("/categoris/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const category = await Category.findOne({
      where: {
        slug: slug,
      },
    });

    if (!category) {
      res.status(500).send("Erro ao recuperar categorias");
    }

    const categoris = await Category.findAll();

    const articles = await Articles.findAll({
      where: {
        categoriaId: category.id,
      },
      include: [{ model: Category }],
    });

    if (articles != undefined && categoris != undefined) {
      res.render("categoris", {
        articles: articles,
        optionsFormar: optionsFormar,
        categoris: categoris,
      });
    } else {
      res.redirect("/");
    }
  } catch (erro) {
    res.status(500).send("Erro ao recuperar categoriaaaaaaaaas");
  }
});

app.listen(PORT, () => {
  console.log("Port 3000!");
});
