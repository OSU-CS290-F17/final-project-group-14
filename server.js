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

var mongoURL = "mongodb://cs290_wilsosam:cs290_wilsosam@classmongo.engr.oregonstate.edu:27017/cs290_wilsosam";

var mongoConnection = null;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

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
app.get('/:user/accountPage/', function (req, res) {
	var collection = mongoConnection.collection('final');
  console.log(req.params.user);
	collection.find({username: req.params.user}).toArray(function (err, results) {

    if (err) {
    res.status(500).send("Database Error");
    } else if (results.length > 0) {

      res.status(200).render('accountPage', results[0]);
    } else {
      res.status(200).render('signIn',{noUser:true});
    }
	});
});

app.get('/:user/accountTransfer/', function (req, res) {
	var collection = mongoConnection.collection('final');
	collection.find({username: req.params.user}).toArray(function (err, results) {
  if (err) {
    res.status(500).send("Database Error");
    } else if (results.length > 0) {

      res.status(200).render('accountTransfer', results[0]);
    } else {
      res.status(200).render('signIn',{noUser:true});
    }
	});
});

app.post('/newAccount/addAccount', function (req, res) {
  var dataCollection = mongoConnection.collection('final')
  if (req.body && req.body.username && req.body.address) {

    dataCollection.find({username: req.body.username}).toArray(function (err, results) {
    if (err) {
      res.status(500).send("Database Error");
      } else if (results.length > 0) {
        res.status(409).send("User already exists");
      } else {

        var accountObj = {
          username: req.body.username,
          address: req.body.address,
          checkings: 0,
          savings: 0,
          history: [{
            date: (new Date()).toDateString(),
            description: "Account Creation",
            balance: 0
          }]
        };
        dataCollection.insert( accountObj );
        res.status(200).send("success");
      }
  	});

  } else {
    res.status(400).send("Request body needs a 'username' field");
  }
});

// Deposit/Withdrawl
app.post('/:user/accountChange', function (req, res) {

  var dataCollection = mongoConnection.collection('final')

  if (req.body && req.body.account && req.body.transaction && req.body.amount) {
    var date = (new Date()).toDateString();
    if(req.body.transaction == "deposit"){
      if(req.body.account == "checkings"){
        dataCollection.updateOne({username:req.params.user},{$inc:{checkings :parseInt(req.body.amount)}});
        var historyObj = {
          date: date,
          description: "Deposit",
          amount: req.body.amount
        };
        dataCollection.updateOne({username: req.params.user},{$push: {history: historyObj}});
      }else{
        dataCollection.updateOne({username:req.params.user},{$inc:{savings:parseInt(req.body.amount)}});
      }
    } else {
      if(req.body.account == "checkings"){
        dataCollection.updateOne({username:req.params.user},{$inc:{checkings :-parseInt(req.body.amount)}});
        var historyObj = {
          date: date,
          description: "Withdraw",
          amount: req.body.amount
        };
        dataCollection.updateOne({username: req.params.user},{$push: {history: historyObj}});
      }else{
        dataCollection.updateOne({username:req.params.user},{$inc:{savings:-parseInt(req.body.amount)}});
      }
    }
    res.status(200).send("success");
  } else {
    res.status(400).send("Request body needs a 'username' field");
  }
});

app.post('/:user/transfer', function (req, res) {
  var dataCollection = mongoConnection.collection('final');
  if (req.body && req.body.amount && req.body.toAccount && req.body.fromAccount) {
    var date = (new Date()).toDateString();
    var num = parseInt(req.body.amount)
    var negNum = 0-num;


    if (req.body.fromAccount == 'checking'){
      console.log('sup');
      dataCollection.updateOne({username:req.params.user},{$inc:{checkings :negNum}});
      dataCollection.updateOne({username:req.params.user},{$inc:{savings:num}});
      var historyObj = {
        date: date,
        description: "Transfer",
        amount: req.body.amount
      };

      dataCollection.updateOne({username: req.params.user},{$push: {history: historyObj}});
    } else {
      dataCollection.updateOne({username:req.params.user},{$inc:{checkings :num}});
      dataCollection.updateOne({username:req.params.user},{$inc:{savings:negNum}});
      var historyObj = {
        date: date,
        description: "Transfer",
        amount: req.body.amount
      };

      dataCollection.updateOne({username: req.params.user}, {$push: {history: historyObj}});
    }
    res.status(200).send("success");
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

  app.listen(port, function () {
    console.log("== Server is listening on port", port);
  });
});
