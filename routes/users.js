var express = require('express');

var router = express.Router();

/* GET users listing. */
/*router.get('/PostUser', function(req, res, next) {
  //res.send(database.Users.find({_id: req.params.id}).fetch());
  res.send(database.Users.InsertOne({Name: "Kay", GitName: "Smog"}));
  console.log("Posted");
});*/

/*router.get('/:id', function (req, res, next) {
  UserInfo.findById(req.params.id, function(err, userinfo){
    if(err) res.send(err);
    res.json(userinfo);
  });
});*/

router.get('/Userinfo', function(res, req){
	console.log("received get request");
})

module.exports = router;
