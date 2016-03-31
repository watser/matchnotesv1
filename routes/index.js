var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // fs.readFile('data/data.json', 'utf8', (err, data) => {
  //   if (err) throw err;
  //   console.log(data);
  // })
  res.render('index', { title: 'CSGO Matchnotes' });
});

module.exports = router;
