var express = require('express');
var router = express.Router();

var query = require('../manager/db-query');
var gen = require('../manager/generate-number');
var validation = require('../manager/url-validation');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'App', name: 'K.Chan' });
});

// Validate the url and make an entry in db
router.get('/new/*', function (req, res, next) {
  // validate url
  var org_url = req.params[0];
  if(!validation.validate(org_url)) {
    res.send({ msg: 'URL format not valid!' });
    res.end();
  } else {
    // if valid then check if already stored in db
    var doc = query.isOrginalURLExists(org_url, function(doc) {
      if(doc) {
        // if exists in db return the same
        res.send({
          original_url: doc[0].original_url,
          short_url: doc[0].short_url
        });
        res.end();
      } else {
        // else create new value and return
        var short_url = gen.generate(org_url);
        short_url = req.headers.host + '/' + short_url;
        if(short_url) {
          res.send({
            original_url: org_url,
            short_url: short_url
          });
          query.createURL(org_url, short_url);
          res.end();
        }  
      }
    });
    
  }
});

// If user sends any short_url param, if entry exists in db, redirect it else return error
router.get('/:value', function (req, res, next) {
  // check db if short_url exist in db
  var short_url = req.headers.host + '/' + req.params.value;
  
  query.isShortURLExists(short_url, function(data) {
    if(data) {
      res.redirect(data[0].original_url);
      res.end();
    } else {
      res.send({ msg: 'Sorry, no url found!'});
      res.end();
    }
  });
  
});

module.exports = router;
