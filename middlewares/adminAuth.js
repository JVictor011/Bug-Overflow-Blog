function addminAuth(req, res, next) {
  if (req.session.user != undefined) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = addminAuth;
