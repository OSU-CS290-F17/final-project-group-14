var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var mongoURL = "mongodb://cs290_wilsosam:cs290_wilsosam@classmongo.engr.oregonstate.edu:27017/cs290_wilsosam";
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
app.get('/', function (req, res) {
  res.status(200).render('homePage');
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
app.get('/accountPage/:user', function (req, res) {
	var collection = mongoConnection.collection('final');
	collection.find({username: req.params.user}).toArray(function (err, results) {
    if (err) {
      res.status(500).send("Database Error");
    } else if (results.length > 0) {
		console.log(results[0]);
      res.status(200).render('accountPage', results[0]);
    } else {
      res.status(200).render('signIn',{noUser:true});
    }
	});
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
  app.listen(port, function () {
    console.log("== Server listening on port:", port);
  });
});

// Pass in mongoConnection and the query wrapped in brackets: {}.
function findDocuments(db, query) {
  var collection = db.collection('final');
  return collection.find(query).toArray(function(err, docs) {
    console.log("Found the following records");
    console.log();
	return docs;
  });
}
