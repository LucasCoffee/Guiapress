const express = require("express");
const app = express();

const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticleController")
const UsersController = require("./User/UserController")

const Article = require("./articles/Article");
const Category = require("./categories/Category")
const User = require("./User/User")

const session = require('express-session');

// sessão. 
app.use(session({
    secret: "njkcnsdkjncjsdanckjdncuiwneiucnsixnc",
    cookie: {
        maxAge: 30000
    },
    resave: true,
    saveUninitialized: true
}));

//view engine
app.set("view engine", "ejs");

//body-parser
const bodyParser = require("body-parser");
const Articles = require("./articles/Article");
const id = require("faker/lib/locales/id_ID");
const { json } = require("body-parser");
const { get } = require("./categories/CategoriesController");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//static
app.use(express.static("public"));

//datebase
connection
    .authenticate()
    .then(() => {
        console.log("conexao com banco OK")
    }).catch((error) => {
        console.log(error)
    })

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", UsersController);

app.get("/", (req, res) => {

    Article.findAll({
        order: [
            ["id", "DESC"]
        ], 
        limit: 4
    }).then(articles  => {
        Category.findAll().then( categories => {
            res.render("index",{articles: articles, categories: categories});
        });
    });

});

app.get("/:slug", (req, res) => {
    let slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then( article => {
        if( article != undefined){
            Category.findAll().then( categories => {
                res.render("article", {article : article, categories : categories});
            });
        }else{
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/")
    })

}); 

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where:{
            slug: slug
        }, 
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories : categories});
            })

        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })

});

app.listen(8080, () => {
    console.log("servidor esta rodando");
});