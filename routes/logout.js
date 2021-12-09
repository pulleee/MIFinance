var express = require('express');
var router = express.Router();

/* handle logout */
router.get('/', function(req, res, next) {
    req.session.destroy(function (err) {
        if(err == undefined){
            console.log("Session destroyed.");
        }else{
            console.log("ERROR: " + err);
        }   
    });
    res.redirect("login");
});

module.exports = router;