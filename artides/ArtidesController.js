const express = require("express");
const router = express.Router();
const Articles = require("./Articles");
const slugify = require("slugify");
const Category = require("../categories/Category");

router.get("/articles", (req, res) => {
  res.send("articles");
});

router.get("/admin/articles/new", async (req, res) => {
  try {
    const categoris = await Category.findAll();
    res.render("admin/articles/new", { categories: categoris });
  } catch (erro) {
    res.status(500).send("Erro ao recuperar categorias");
  }
});

router.post("/articles/save", (req, res) => {
  var [title, body] = req.body;
  if (title != undefined || body != undefined) {
    Articles.create({
      title: title,
      slug: slugify(title).toLowerCase(),
      body: body,
    }).then(() => {
      res.redirect("/artigos");
    });
  } else {
    res.redirect("/artigos/new");
  }
});

router.get("/artigos", (req, res) => {
  res.send("artides");
});

module.exports = router;
