var express = require('express');
var path = require('path');
var request = require("request");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var showdown = require('showdown');
var PreviousAmount = 10;

//MongoConnection
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/BapAutomiserDB');
var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error...'));
db.once('open', function callback(){
  console.log('BapAutomiserDB opened');
});

var app = express();

/*//Hourly Call to Api
  console.log("in the function");
  var apiCallLogCommits = "https://api.github.com/repos/kayelst/CA_BAPAutomatisering/commits?path=Logfiles&since=2016-11-15T13:1:27Z&client_id=651b11583f0162b4cc91&client_secret=e42b41de694254d711122267d88d3bd884ad2de4";
  $http.get(apiCallLogCommits).then(function(response){
    var CurrentAmount = response.data.length;
    console.log(CurrentAmount);
    if (CurrentAmount > PreviousAmount){
      console.log("Logs have been added");
      PreviousAmount = CurrentAmount;
    }
  });*/

/* DBSTUFF DELETE LATER
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
});*/

var request = require("request");

var routes = require('../routes/index');
var users = require('../routes/users');

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

var ServerUsercode;// = {Usercode : "abcdefghijklm"};


app.post('/ClientToServer', function(req, res){
    console.log("receiving Usercode");
    console.log(req.body.body);
    ServerUsercode = req.body.body;
    console.log("Done Recieving");

    var requestData = {"client_id": "651b11583f0162b4cc91", "client_secret": "cc5f94be35b0ccf9891b55dd6d670f3f7cf29388", "code": ServerUsercode};
    
    console.log(requestData);
    request.get("https://github.com/login/oauth/access_token?client_id=651b11583f0162b4cc91&client_secret=cc5f94be35b0ccf9891b55dd6d670f3f7cf29388&code=" + ServerUsercode, 
    function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
        else {  
            console.log("error: " + error)
            console.log("response.statusCode: " + response.statusCode)
            console.log("response.statusText: " + response.statusText)          
        }
    });
});

//db accessible for router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
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
});*/


module.exports = app;
