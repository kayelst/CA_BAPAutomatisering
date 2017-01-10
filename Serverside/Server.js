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

var helper = require('sendgrid').mail;

app.post('/MailScriptie', function(req,res) {
    var MissingUser = req.body.body;
    var Promotor = req.body.promotor;

    from_email = new helper.Email("noreply@BapAutomizer.com");
    to_email = new helper.Email("kayelst@gmail.com");
    subject = "De student " + MissingUser + "heeft geen scriptie";
    content = new helper.Content('text/plain', "De student heeft nog geen scriptie en is hiervan op de hoogte gebracht");
    mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')('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');
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });

});

app.post('/MailLog', function(req,res) {
    var MissingUser = req.body.body;
    var Promotor = req.body.promotor

    from_email = new helper.Email("noreply@BapAutomizer.com");
    to_email = new helper.Email("kayelst@gmail.com");
    subject = "De student " + MissingUser + "heeft geen LogFile";
    content = new helper.Content('text/plain', "De student heeft nog geen LogFile en is hiervan op de hoogte gebracht");
    mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')('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');
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });

});


app.post('/MailInfo', function(req,res) {
    var MissingUser = req.body.body;
    var Promotor = req.body.promotor

    from_email = new helper.Email("noreply@BapAutomizer.com");
    to_email = new helper.Email("kayelst@gmail.com");
    subject = "De student " + MissingUser + "heeft geen InfoFile";
    content = new helper.Content('text/plain', "De student heeft nog geen InfoFile en is hiervan op de hoogte gebracht");
    mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')('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');
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });

});


module.exports = app;
