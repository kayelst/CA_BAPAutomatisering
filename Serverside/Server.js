var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//MongoConnection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BapAutomiserDB');
var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error...'));
db.once('open', function callback(){
  console.log('BapAutomiserDB opened');
});

var UserInfoSchema = new mongoose.Schema({
  name: String,
  GitName: String,
  Repo: String,
  Promotor: String,
  Phone: String,
  Address: String,
  Updated_At: {type: Date, default: Date.now}
});

var UserInfo = mongoose.model('Userinfo', UserInfoSchema);

var userinfo = new UserInfo({name: 'Kay', GitName: 'Kayelst', Repo: 'RepoNaam', Promotor: 'Tim_Dams', Phone: '0476555636', Address: 'Kievitstraat2'});

userinfo.save(function(err){
  if(err)
    console.log (err);
  else
    console.log(userinfo);
});

var routes = require('../routes/index');
var users = require('../routes/users');

var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

//db accessible for router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
