var express = require('express');
var router = express.Router();

const helpers = require('../modules/helpers');
const transactionModel = require('../modules/transactionModel');
const userModel = require('../modules/userModel.js');

/* GET buy page. */
router.get('/', function(req, res, next) {
    if(req.session.user == undefined){
        renderError(res, req, "You need to be logged in to see this page!");
    }else{
        renderBuy(res, req);
    }
});

router.post('/', async (req, res) => {
    const symbol = req.body.symbol;
    const shares = req.body.shares;

    if(symbol == "" || shares <= 0){
        renderError(res, req, "Invalid input!");
        return;
    }

    try{
        //get share info
        let result = await helpers.lookup(symbol);
        let price = result.latestPrice * shares;
        if(req.session.user.credit <= price){
            renderError(res, req, "Sorry, you don't have enough credits to buy this share!");
            return;
        }     

        //put in transaction, rollback on error
        transactionModel.createTransaction(result.companyName, result.symbol, shares, result.latestPrice, req.session.user.id, function(transaction_success){
            if(transaction_success){
                //update user balance
                let credit = req.session.user.credit - price;
                userModel.updateUserCredit(req.session.user.id, credit, function(user_success){
                    if(user_success){
                        req.session.user.credit = credit;
                        renderBuy(res, req, "Transaction successful!");
                    }else{
                        renderError(res, req, "Sorry, something unexpected happened!");
                    }
                });
            }else{
                renderError(res, req, "Sorry, something unexpected happened!");
            }
        }); 
    }catch(err){
        console.log(err)
        renderError(res, req, "Sorry, an error occured while getting share infos.");
    }
});

function renderBuy(res, req, msg){
    res.render('buy', {
        transaction_successful: msg,
        user: req.session.user,
    });
}

function renderError(res, req, msg){
    res.status(400).render("error", {
        error: msg,
        user: req.session.user
    });
}

module.exports = router;