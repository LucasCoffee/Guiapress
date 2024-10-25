const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const AdminAuth = require("../middlewares/adminAuth");


router.get("/categories", AdminAuth, (req, res) => {
    res.send("Rota de categorias");
});

router.get("/admin/categories/new", AdminAuth, (req, res) => {
    res.render("admin/categories/new");
});

router.post("/Categories/save",AdminAuth,  (req, res) => {
    var title = req.body.title;

    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title) 
        })
        .then(() => {
            res.redirect("/admin/categories");
        })
        .catch((err) =>{
            console.log(err);
        });
    }else{
        res.redirect("/admin/categories/new")
    }
});

router.get("/admin/categories", AdminAuth, (req, res) => {

    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories : categories});
    });

});

router.post("/categoties/delete", AdminAuth, (req, res) => {
    var id = req.body.id;

    if(id != undefined){
        if (!isNaN(id)) {
            Category.destroy({
                where: {
                    id:id
                }
            }).then(() =>{
                res.redirect("admin/categories");
            })
        } else {
            res.redirect("admin/categories");
        }
    }else{
        res.redirect("admin/categories");
    }
});

router.get("/admin/categories/edit/:id", AdminAuth, (req, res) => {
     let id = req.params.id

     if(isNaN(id)){
        res.redirect("/admin/categories");
     }else{
        Category.findByPk(id).then(category => {
            if(category != undefined){
                res.render("/admin/categories/edit", {category : category});
            }else{
                res.redirect("/admin/categories");
            }
        }).catch(erro => {
            res.redirect("/admin/categories");
        })
     } 
});

router.post("/categories/update", AdminAuth, (req, res) => {
    let id = req.body.id 
    let title = req.body.title

    Category.update({title : title, slug : slugify(title)}, {
        where: {
            id : id 
        }
    }).then(() => {
        res.redirect("/admin/categories")
    });

});

module.exports = router;