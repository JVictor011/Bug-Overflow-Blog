const express = require("express");
const router = express.Router();
const Articles = require("./Articles");
const slugify = require("slugify");
const Category = require("../categories/Category");
const optionsFormar = require("../utils/optionsFormar");

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

router.post("/admin/articles/update", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const body = req.body.body;
  const category = req.body.category;

  Articles.update(
    {
      title: title,
      slug: slugify(title).toLowerCase(),
      body: body,
      categoriaId: category,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then(() => {
      res.redirect("/admin/articles");
    })
    .catch(() => {
      res.status(500).send("Erro ao atualizar artigo.");
    });
});

router.get("/articles/page/:num", async (req, res) => {
  try {
    const page = req.params.num;
    const limit = 4;
    var pageNum = 0;
    var offset = 0;

    if (isNaN(page) || page == 1) {
      pageNum = 1;
    } else {
      pageNum = parseInt(page);
    }

    offset = (pageNum - 1) * limit;

    const articles = await Articles.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]],
      include: [{ model: Category }],
    });

    if (!articles) {
      res.status(500).send("Erro ao recuperar artigos");
    }

    var next = true;
    if (offset + limit >= articles.count) {
      next = false;
    } else {
      next = true;
    }

    const categoris = await Category.findAll();

    const result = {
      page: pageNum,
      next: next,
      articles: articles,
    };

    res.render("admin/articles/page", {
      result: result,
      categoris: categoris,
      optionsFormar: optionsFormar,
    });
  } catch (erro) {
    res.status(500).send("Erro ao recuperar artigos");
  }
});

module.exports = router;
