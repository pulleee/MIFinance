var express = require('express');
var router = express.Router();

/* GET history page. */
router.get('/', function(req, res, next) {
    res.render("error", {user: req.session.user});
});

module.exports = router;