var express = require('express');
var gitstar = require('../git_star');
var router = express.Router();

var username = "";
var value = "";
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'GitHub Star Index',
    username: username,
    message: value
  });
});

router.post('/', function (req, res, next) {
  username = req.body.input;
  gitstar(username, function (result, message) {
    if (message.length > 0) {
      value = message;
    } else {
      value = "Star-Index: " + result;
    }
    res.redirect('/');
  });
});


module.exports = router;