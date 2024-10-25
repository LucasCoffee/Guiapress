const express = require("express");
const router = express.Router();
const User = require("./User");
const bcript = require('bcryptjs');
const id = require("faker/lib/locales/id_ID");
const { json } = require("body-parser");

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render('admin/user/users', {users : users})
    })
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/user/create");
});

router.post("/users/create", (req, res) => {
   let email = req.body.email 
   let password = req.body.password

   User.findOne({
    where:{email : email}
   }).then(user => {
    if (user == undefined) {
        let salt = bcript.genSaltSync(10);
        let hash = bcript.hashSync(password, salt);

        User.create({
            email: email, 
            password: hash
        }).then(() => {
            res.redirect('/admin/users')
        }).catch((err) => {
            res.redirect('/')
            console.log(err)
        })
    } else {
        res.redirect('/admin/users/create')
    }
   })
});

router.get("/login", (req, res) => {
    res.render("admin/user/login")
});

router.post("/authenticate", (req, res) => {
   let email =  req.body.email
   let password = req.body.password

    User.findAll({
        where: {email : email}
    }).then( user => {
        let eUsuario;

        user.forEach(element => {
            eUsuario = element
        });

        if (eUsuario != undefined) {

            let correct = bcript.compareSync(password, eUsuario.password);

            if (correct) {
                req.session.user = {
                    id: eUsuario.id,
                    email : eUsuario.email
                }
                res.redirect("/")
            } else {
                res.redirect("/login")
            }

        } else {
            res.redirect("/login")
        }
    } )
   
});

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router