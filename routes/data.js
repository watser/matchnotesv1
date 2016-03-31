var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // fs.readFile('data/data.json', 'utf8', (err, data) => {
  //   if (err) throw err;
  //   console.log(data);
  // })
  res.send('lalala')
});

module.exports = router;
