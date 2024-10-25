const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Articles = require("./Article");
const slugfy = require("slugify");
const AdminAuth = require("../middlewares/adminAuth");


router.get("/admin/articles", AdminAuth, (req, res) => {
    Articles.findAll(
        {include: [{model: Category}]}
    ).then(articles => {
        res.render("admin/articles/index", {articles : articles})
    })
})
 
router.get("/admin/article/new", AdminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories : categories})
    })
    
});

router.post("/articles/save", AdminAuth, (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Articles.create({
        title : title,
        slug: slugfy(title),
        body: body, 
        categoryId: category 
    }).then(() => {
        res.redirect("/admin/articles")
    })

}); 

router.post("/articles/delete", AdminAuth, (req, res) => {
    var id = req.body.id;

    if(id != undefined){
        if (!isNaN(id)) {
            Articles.destroy({
                where: {
                    id:id
                }
            }).then(() =>{
                res.redirect("/admin/articles");
            })
        } else {
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("admin/categories");
    }
});

router.get("/admin/articles/edit/:id", AdminAuth, (req, res) => {
    let id = req.params.id 

    Articles.findByPk(id).then( article => {
        if (article != null) {

            Category.findAll().then( categories => {
                res.render("admin/articles/edit", {article: article, categories : categories})
            })

        } else {    
            res.redirect("admin/articles/edit")
        }
    }).catch(err => {
        res.redirect("/")
    })

});

router.post("/admin/articles/update", AdminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Articles.update({
        title: title,
        body: body,
        categoryId: category,
        slug: slugfy(title)}, 
        {
            where: { id : id}
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch((err) => {
            console.log(err)
            res.redirect("/");
        })

});

router.get("/articles/page/:num", (req, res) => {
    let page = req.params.num;
    let offset;

    if (isNaN(page) || page == 1  ) {
        offset = 0;
    } else {
       offset = (parseInt(page) - 1 ) * 4;
       
    }

    Articles.findAndCountAll({
        limit: 4,
        offset : offset,
        order: [
            ["id", "DESC"]
        ] 
    }).then(articles => {
        let next;
        if (offset + 4 >= articles.count) {
            next = false
        } else {
            next = true
        }

        let result = {
            page: parseInt(page),
            next: next, 
            articles : articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories : categories})
        })

    });
})


module.exports = router;