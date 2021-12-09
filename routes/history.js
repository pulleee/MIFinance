var express = require('express');
var router = express.Router();

const transactionModel = require('../modules/transactionModel');

/* GET history page. */
router.get('/', function(req, res, next) {
    let no_login = (req.session.user == undefined);
    if(no_login){
        renderError(res, req, "You need to be logged in to see this page!");
    }else{
        next();
    }
}, function(req, res){
    transactionModel.getTransactionByUserId(req.session.user.id, function(success, data){
        if(success){
            res.render("history", { transactions: data, user: req.session.user });
        } else{
            renderError(res, req, "Sorry, something unexpected happened!")
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