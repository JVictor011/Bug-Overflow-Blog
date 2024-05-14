const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  //   User.findAll().then((users) => {
  //     res.render("admin/users/index", { users: users });
  //   });
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
  const { username, password } = req.body;

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  User.create({
    username: username,
    password: hash,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      res.status(500).send("Erro ao cadastrar usuário.");
    });
});

module.exports = router;
