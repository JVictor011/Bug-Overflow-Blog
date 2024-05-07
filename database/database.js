const Sequelize = require("sequelize");

const connection = new Sequelize("bug-overflow-blog", "root", "jovi", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
