require('dotenv').config();
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
global.mongoose = require('mongoose');
//var uri = 'mongodb://vimal:123456@ds159978.mlab.com:59978/bookstore'; // for testing

var uri = 'mongodb://vimal:123456@ds155582.mlab.com:55582/librarydb';
global.db = mongoose.connect(uri);
global.Schema = mongoose.Schema;

var schemalibrary = new Schema({
	name: String,
	time: Number
}, {
collection: 'Library'});
global.modelLibrary = mongoose.model('Library', schemalibrary);

var schemabook = new Schema({
	bookname: String,
	libraryId:String,
userIssuedToId: {type: String, default:''},
	isIssued :{type: Number, default: 0},
	time: Number
}, {
collection: 'Books'});
global.modelBooks = mongoose.model('Books', schemabook);

var schemaUser = new Schema({
	name: String,
	email:String,
	libraryId:String,
	password: String,
	time: Number
}, {
collection: 'User'});
global.modelUser = mongoose.model('User', schemaUser);


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
 secret: 'cookie_secretsss',
 resave: true,
 saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.baseURL = 'http://' + process.env.APP_HOST + ':' + process.env.APP_PORT;

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');

  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.set('port',process.env.APP_PORT || 3000);
var server = app.listen(app.get('port'), function() {
 console.log('Express server listening on port ' + server.address().port);
});
module.exports = app;
