var express = require('express');
var router = express.Router();

const helpers = require('../modules/helpers')

/* GET quote page. */
router.get('/', function(req, res, next) {
    if(req.session.user == undefined){
        renderError(res, req, "You need to be logged in to see this page!");
    }else{
        renderQuote(res, req);
    }
});

router.post("/",  async (req, res) => {
    const symbol = req.body.symbol;
    //get share info
    let result;
    try{
        result = await helpers.lookup(symbol);
        let msg = "Eine " + result.companyName + "(" + result.symbol + ") Aktie kostet $ " + result.latestPrice;
        renderQuote(res, req, msg);
    }catch(err){
        console.log(err)
        renderError(res, req, "Sorry, an error occured while getting share infos.");
    }
});

function renderQuote(res, req, msg){
    res.render("quote", {
        result: msg,
        user: req.session.user
    });
}

function renderError(res, req, msg){
    res.status(400).render("error", {
        error: msg,
        user: req.session.user
    });
}

module.exports = router;