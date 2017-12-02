var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB;

var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword +
  '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;

var mongoConnection = null;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

var port = process.env.PORT || 3000;

/* These get requests will need some more work as we get further on
 * there is nothing being passed in to generate dynamic content like in the accoutPage
 * We will also need to decide what we want the data in our database to look like
 * before I can really move forward with some of this stuff
 */

// root path
app.get('/:username/accountPage', function (req, res) {
  dataCollection.find({ username: req.params.username }).toArray(funtion (err, results) {
    if (err){
      res.status(500).send("Error fetching account data");
    }else if (results > 0) {
      res.status(200).render('accountPage', {
        account: results
      });
    }
  })
  res.status(200).render('accountPage');
});

// signIn page
app.get('/signIn', function (req, res) {
  res.status(200).render('signIn');
});

//signUp page
app.get('/signUp', function (req, res) {
  res.status(200).render('signUp')
});

// accountPage
app.get('/accountPage', function (req, res) {
  res.status(200).render('accountPage');
});

app.post('/signUp/addAccount', function (req, res) {

  if (req.body && req.body.username) {
    var accountObj = {
      username: req.body.username,

    };

    dataCollection.insert( accountObj );
  } else {
    res.status(400).send("Request body needs a 'username' field");
  }
});

app.use(express.static('public'));

// 404 page
app.get('*', function (req, res) {
  res.status(404).render('404');
});
MongoClient.connect(mongoURL, function (err, connection) {
  if (err) {
    throw err;
  }
  mongoConnection = connection;
  var dataCollection = mongoConnection.collection()
  app.listen(port, function () {
    console.log("== Server is listening on port", port);
  });
})
