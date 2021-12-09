var express = require('express');
var router = express.Router();

const userModel = require('../modules/userModel.js');

/* GET profile page. */
router.get('/', function(req, res, next) {
    if(req.session.user == undefined){
        renderError(res, req, "You need to be logged in to see this page!");
    }else{
        res.render("profile", {
            user: req.session.user
        });
    }
});

router.post('/updatePassword', function (req, res) {
    const password = req.body.password;
    const confirmation = req.body.confirmation;

    if(password == "" || password != confirmation) {    
        renderError(res, req, "Sorry, Passwords are invalid!");
        return;
    }

    userModel.updateUserPaadminssword(req.session.user.id, password, function(success){
        if(success){
            res.redirect("/");
        }else{
            renderError(res, req, "Something unexpected happened!");
        }
    });
});

router.post('/updateCredit', async (req, res) => {
    const deposit = req.body.deposit;
    let credit = parseFloat(req.session.user.credit) + parseFloat(deposit);
    userModel.updateUserCredit(req.session.user.id, req.session.user.credit, function(success){
        if(success){
            req.session.user.credit = credit;
            res.redirect("/");
        }else{
            renderError(res, req, "Something unexpected happened!");
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