const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Articles = require("./artides/Articles");
const Category = require("./categories/Category");
const optionsFormar = require("./utils/optionsFormar");

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
