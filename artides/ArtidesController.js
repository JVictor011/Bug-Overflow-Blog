const express = require("express");
const router = express.Router();
const Articles = require("./Articles");
const slugify = require("slugify");
const Category = require("../categories/Category");

router.get("/admin/articles", (req, res) => {
  try {
    Articles.findAll({
      include: [{ model: Category }],
    }).then((articles) => {
      res.render("admin/articles/index", { articles: articles });
    });
  } catch (erro) {
    res.status(500).send("Erro ao recuperar artigos");
  }
});

router.get("/admin/articles/new", (req, res) => {
  try {
    Category.findAll().then((categoris) => {
      res.render("admin/articles/new", { categories: categoris });
    });
  } catch (erro) {
    res.status(500).send("Erro ao recuperar categorias");
  }
});

router.post("/articles/save", (req, res) => {
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category;
  if (title != undefined || body != undefined) {
    Articles.create({
      title: title,
      slug: slugify(title).toLowerCase(),
      body: body,
      categoriaId: category,
    }).then(() => {
      res.redirect("/admin/articles");
    });
  } else {
    res.redirect("/admin/artigos/new");
  }
});

router.post("/articles/delete", (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Articles.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/articles");
      });
    } else {
      res.redirect("/admin/articles");
    }
  } else {
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", async (req, res) => {
  try {
    var id = req.params.id;

    if (isNaN(id)) {
      res.redirect("/admin/articles");
    }

    const article = await Articles.findByPk(id, {
      include: [{ model: Category }],
    });

    if (!article) {
      return res.redirect("/admin/articles");
    }

    const categories = await Category.findAll();

    res.render("admin/articles/edit", {
      article: article,
      categories: categories,
    });
  } catch (erro) {
    res.status(500).send("Erro ao carregar página de edição.");
  }
});

module.exports = router;
