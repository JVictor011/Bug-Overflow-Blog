const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "username"],
  });
  if (users) {
    res.render("admin/users/index", { users: users });
  } else {
    return res.status(500).send("Erro ao recuperar usuários");
  }
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/delete", (req, res) => {
  const userId = req.body.id;
  if (userId != undefined) {
    if (!isNaN(userId)) {
      User.destroy({
        where: {
          id: userId,
        },
      }).then(() => {
        res.redirect("/admin/users");
      });
    } else {
      res.redirect("/admin/users");
    }
  } else {
    res.redirect("/admin/users");
  }
});

router.post("/users/create", async (req, res) => {
  try {
    const { username, password } = req.body;

    const emailExists = await User.findOne({
      where: {
        username: username,
      },
    });

    if (emailExists != undefined) {
      return res.status(400).send("Username já cadastrado.");
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    const createUser = await User.create({
      username: username,
      password: hash,
    });

    if (createUser) {
      res.redirect("/");
    } else {
      return res.status(500).send("Erro ao cadastrar usuário.");
    }
  } catch (erro) {
    return res.status(500).send("Erro ao cadastrar usuário.");
  }
});

module.exports = router;
