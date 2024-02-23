const express = require("express");
const router = express.Router();

router.get("/categoria", (req, res) => {
  res.send("CategoriesRoute");
});

module.exports = router;
