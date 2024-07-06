const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const addminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", addminAuth, async (req, res) => {
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

router.post("/users/delete", addminAuth, (req, res) => {
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

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(400).send("Usuário ou senha inválidos.");
    }

    var correct = bcrypt.compareSync(password, user.password);

    if (!correct) {
      res.redirect("/login");
    }

    req.session.user = {
      id: user.id,
      username: user.username,
    };

    res.redirect("/admin/articles");
  } catch (erro) {
    return res.status(500).send("Erro ao logar.");
  }
});

router.get("/admin/users/logout", addminAuth, (req, res) => {
  req.session.destroy((erro) => {
    if (erro) {
      res.redirect("/");
    }
    res.redirect("/login");
  });
});

module.exports = router;
