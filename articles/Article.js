const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Articles =  connection.define("articles", {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Articles); //uma categoria para muitos artigos 
Articles.belongsTo(Category) //um artigo pertece a uma categoria

module.exports = Articles;