var express = require('express');
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
  value = "aaa";
  res.redirect('/');
});


module.exports = router;