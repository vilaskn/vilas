var express = require('express');
var md5 = require('js-md5');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();

// function checkUser(userid, password, callback){
//   var collection = db.collection('users');
//   collection.find({'email': userid, 'password': password},{'password': 0}).toArray(function(err, docs) {
//     if(err)
//       callback(err, null);
//     else
//       callback(null, docs[0]);
//   });
// }
console.log("loading Index");
router.get('/', function (req, res, next) {
  res.render('index', { layout: 'layout-index', navHome: true });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', showFooter: true, navAbout: true });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', showFooter: true, navContact: true });
});

 router.post('/contact', function(req, res, next) {
  // read the values passed from the ui
  var data = req.body;
  console.log(JSON.stringify(data));
  var args = {
    data: req.body,
    headers: { "Content-Type": "application/json" }
};
  client.post("http://localhost:3030/contact", args, 
        function (jsonData, response) {
            // parsed response body as js object
            console.log(jsonData);
            // raw response
            // console.log(response);
            res.render('confirm', { title: 'Contact', showFooter: true, navContact: true, data: data });
        });
  
});

router.get('/resume', function(req, res, next) {
  res.redirect('/vil resume.pdf'); 
});

router.get('/signin', function(req, res, next) {
  res.render('admin/signin', { layout: 'layout-signin' });
});

router.post('/signin', function(req, res, next) {
  var email = req.body.email;
  var password = md5(req.body.password);
  // validate inputs
  req.checkBody('email', 'Email is required').
      notEmpty().withMessage('Email can not be empty').
      isEmail().withMessage('Please enter a valid email');
  req.checkBody('password', 'Password is required').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
        messages.push(error.msg);
    });
    res.render('admin/signin', {layout:'layout-signin', error: messages.length > 0,messages: messages});
  }else{   
    // authenticate the user details
   // User.find({'email': email, 'password': password}, function(err, user){
    var args = {
      data: {'email': email, 'password': password},
      headers: { "Content-Type": "application/json" }
    };   
    client.get("http://localhost:3030/signin", args, function (jsonData, response) {
      // parsed response body as js object
      console.log(jsonData.data); 
      var user = jsonData.data;
      if (jsonData.code == 500){
        res.render('admin/signin', { 
          layout: 'layout-signin', 
          error: true, 
          messages:[err.msg]
        });
      }else if (user.length < 1){
        res.render('admin/signin', { 
          layout: 'layout-signin', 
          error: true, 
          messages:["Invalid userid or passsword"]
        });
      }else{
        // you found a valid user
        // set the session
        console.log(JSON.stringify(user));
        req.session.isAuthenticated = true;
        req.session.user = user[0];
        res.locals.user = user[0];
        res.render('admin/dashboard', { 
          layout: 'layout-admin', 
          title: 'Admin Dashboard',
          navDashboard: true
        });
      }
    });

  }
});

router.get('/signup', function(req, res, next) {
  res.render('admin/signup', { layout: 'layout-signin' });
});

router.post('/signup', function(req, res, next) {
  // read the values from the body
  // [ take the password and encrypt it ]
  // use the model and save the data
  var args = {
    data: req.body,
    headers: { "Content-Type": "application/json" }
  };   
  client.post("http://localhost:3030/signup", args, function (jsonData, response) {
    // parsed response body as js object
    //console.log(jsonData.code); 
    if (jsonData.code == 500){
      res.redirect('/signup');
    }
    else
    {
      res.redirect('/signin');
    }
  });  
});

router.get('/signout', function(req, res, next) {
  req.session.isAuthenticated = false;
  delete req.session.user;
  res.redirect('/signin'); 
});

module.exports = router;