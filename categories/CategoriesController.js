const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const { where } = require("sequelize");

router.get("/admin/categoris/new", (req, res) => {
  res.render("admin/categoris/new");
});

router.post("/categoris/save", (req, res) => {
  var title = req.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: slugify(title).toLowerCase(),
    }).then(() => {
      res.redirect("/admin/categoris");
    });
  } else {
    res.redirect("/admin/categoris/new");
  }
});

router.get("/admin/categoris", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/categoris/index", { categories: categories });
  });
});

router.post("/categoris/delete", (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/categoris");
      });
    } else {
      res.redirect("/admin/categoris");
    }
  } else {
    res.redirect("/admin/categoris");
  }
});

router.get("/admin/categoris/edit/:id", (req, res) => {
  var id = req.params.id;

  if (isNaN(id)) {
    res.redirect("/admin/categoris");
  }

  Category.findByPk(id)
    .then((category) => {
      if (category != undefined) {
        res.render("admin/categoris/edit", { category: category });
      } else {
        res.redirect("/admin/categoris");
      }
    })
    .catch((erro) => {
      res.redirect("/admin/categoris");
    });
});

router.post("/admin/categoris/update", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  if (title != undefined) {
    Category.update(
      { title: title, slug: slugify(title).toLowerCase() },
      {
        where: {
          id: id,
        },
      }
    ).then(() => {
      res.redirect("/admin/categoris");
    });
  } else {
    res.redirect("/admin/categoris");
  }
});

module.exports = router;
