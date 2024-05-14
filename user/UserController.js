const express = require("express");
const router = express.Router();
const User = require("./User");

router.get("/admin/users", (req, res) => {
  //   User.findAll().then((users) => {
  //     res.render("admin/users/index", { users: users });
  //   });
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

module.exports = router;
