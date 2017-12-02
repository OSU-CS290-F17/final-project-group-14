var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

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
app.get('/accountPage', function (req, res) {
  res.status(200).render('accountPage');
});

app.use(express.static('public'));

// 404 page
app.get('*', function (req, res) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
