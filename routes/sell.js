var express = require('express');
var router = express.Router();

const userModel = require('../modules/userModel.js');
const transactionModel = require('../modules/transactionModel');
const helpers = require('../modules/helpers');

/* GET sell page. */
router.get('/', function(req, res, next) {
    if(req.session.user == undefined){
        renderError(res, req, "You need to be logged in to see this page!");
    }else{
        renderSell(res, req);
    }
});

router.post('/', async (req, res) => {
    const symbol = req.body.symbol;
    const shares = req.body.shares;

    if(symbol == undefined || shares <= 0){
        renderError(res, req, "Invalid input!");
        return;
    }

    transactionModel.getSymbolAmountByUserId(req.session.user.id, symbol, async (success, data) => {
        if(!success) { renderError(res, "Sorry, something unexpected happened!"); } else {
            if(data.amount < shares){
                renderError(res, req, "You can't sell more shares that you own!");
            }else{
                try{
                    //get share info
                    let result = await helpers.lookup(symbol);
                    let price = result.latestPrice * shares;
                    //put in transaction, rollback on error
                    transactionModel.createTransaction(result.companyName, result.symbol, -shares, result.latestPrice, req.session.user.id, function(transaction_success){
                        if(transaction_success){
                            //update user balance
                            let credit = parseFloat(req.session.user.credit) + parseFloat(price);
                            userModel.updateUserCredit(req.session.user.id, credit, function(user_success){
                                if(user_success){
                                    req.session.user.credit = credit;
                                    renderSell(res, req, "Transaction successful!");
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
            }   
        }
    });
});

function renderSell(res, req, message){
    transactionModel.getSymbolsByUserId(req.session.user.id, function(success, data){
        if(success){
            res.render("sell", { shares: data, transaction_successful: message, user: req.session.user });
        }else{
            renderError(res, "Sorry, something unexpected happened!");
        }
    });
}
function renderError(res, req, msg){
    res.status(400).render("error", {
        error: msg,
        user: req.session.user
    });
}

module.exports = router;