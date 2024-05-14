const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Articles = connection.define("articles", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

//Relationship between articles and category
Category.hasMany(Articles); //one for many
Articles.belongsTo(Category); //one to one

Articles.sync({ force: false });

module.exports = Articles;
