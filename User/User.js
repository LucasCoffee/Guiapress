const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define("User", {
    email:{
        type: Sequelize.STRING,
        allowNUll: false
    }, password: {
        type: Sequelize.STRING,
        allowNUll: false
    }
});

module.exports = User