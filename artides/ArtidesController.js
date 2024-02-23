const express = require("express");
const router = express.Router();

router.get("/artigos", (req, res) => {
  res.send("artides");
});

module.exports = router;
