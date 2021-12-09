var express = require('express');
var router = express.Router();

const userModel = require('../modules/userModel.js');

/* GET register page. */
router.get('/', function(req, res, next) {
    if(req.session.user == undefined){
        res.render("register");
    }else{
        renderError(res, "Logour first!");
    }
});

router.post("/", function (req, res) {   
    const username = req.body.username;
    const password = req.body.password;
    const confirmation = req.body.confirmation;

    if(username == ""){
        renderError(res, "Sorry, Username can't be empty!");
        return;
    }

    if(password == "" || password != confirmation) {    
        renderError(res, "Sorry, Passwords are invalid!");
        return;
    }

    userModel.createUser(username, password, function(success){
        if(success){
            res.redirect("login");
        }else{
            renderError(res, "Sorry, Username already exists!");
        }
    });
});

function renderError(res, msg){
    res.status(400).render("error", {
        error: msg,
        user: undefined
    });
}

module.exports = router;