var express = require('express');
var router = express.Router();

const helpers = require('../modules/helpers');
const transactionModel = require('../modules/transactionModel');

/* GET home page. */
router.get('/', async (req, res, next) => {
    if(req.session.user == undefined){
        res.redirect("login")
    }else{
        next();
    }
}, function(req, res){
    transactionModel.getSharesByUserId(req.session.user.id, async (success, data) => {
        if(success){
            try{
                let totalValue = 0;
                for(share of data){      
                    let result = await helpers.lookup(share.symbol);
                    let totalPrice = result.latestPrice * share.totalamount;
                    share.price = result.latestPrice.toFixed(2);
                    share.totalPrice = totalPrice.toFixed(2);
                    totalValue += totalPrice;
                }
                let userCredit = parseFloat(req.session.user.credit)
                totalValue += userCredit;
                res.render("portfolio", { transactions: data, credit: userCredit.toFixed(2), totalValue: totalValue.toFixed(2), user: req.session.user });
            }catch(err){
                console.log(err)
                renderError(res, req, "Sorry, an error occured while getting share infos.");
            }
        } else{
            renderError(res, req, "Sorry, something unexpected happened!");
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