var express = require('express');
var router = express.Router();

const userModel = require('../modules/userModel.js');

/* GET login page. */
router.get('/', function(req, res, next) {
    if(req.session.user == undefined){
        res.render("login");
    }else{
        renderError(res, req, "You need to logout first!");
    }
});

router.post("/",  function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if(password == "" || username == "") {    
        renderError(res, req, "Sorry, username must be given!");
        return;
    }

    userModel.loginUser(username, password, function(success, data){
        if(success){
            req.session.user = data;
            res.redirect("/");
        }else{
            renderError(res, req, "Sorry, username and password do not match!");
        }
    });
});

function renderError(res, req, msg){
    res.status(400).render("error", {
        error: msg,
        user: req.session.user
    });
}

module.exports = router;