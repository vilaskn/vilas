var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();
var mediaService = require('../service/mediaService');
var path = require('path');
var fs = require('fs');

router.get('/', function (req, res, next) {
  res.render('admin/dashboard', { 
    layout: 'layout-admin', 
    title: 'Admin Dashboard',
    navDashboard: true
  });
});

router.get('/projects', function (req, res, next) {
    client.get("http://localhost:3030/projects", function (jsonData, response) {
        // parsed response body as js object
        //console.log(jsonData);
        // raw response
        // console.log(response);
        res.render('admin/projects', { 
          layout: 'layout-admin', 
          title: 'Projects Admin',
          navProjects: true,
          projects:   jsonData.data
        });
    });
});

router.get('/projects/create', function (req, res, next) {
  console.log("create");
  res.render('admin/project-create', { 
    layout: 'layout-admin', 
    title: 'Projects Admin',
    navProjects: true
  });
});

router.post('/projects/create', function (req, res, next) {
  var data = req.body;
  //console.log(JSON.stringify(data));
  var args = {
      data: req.body,
      headers: { "Content-Type": "application/json" }
  };
  client.post("http://localhost:3030/projects", args, function (jsonData, response) {
          // parsed response body as js object
          //console.log(jsonData);
          // raw response
          // console.log(response);
          res.redirect('/admin/projects');
      });  
});

router.get('/projects/:projectAlias', function (req, res, next) {
  client.get("http://localhost:3030/projects/"+ req.params.projectAlias, 
      function (jsonData, response) {
          // parsed response body as js object
          //console.log(jsonData);
          // raw response
          // console.log(response);

          res.render('admin/project-detail', { 
            layout: 'layout-admin', 
            title: jsonData.data.name,
            navProjects: true,
            project: jsonData.data
          });
      });
});

router.post('/projects/:projectAlias/update', function (req, res) {
   var data = req.body;
 // console.log(JSON.stringify(data));
  var args = {
      data: req.body,
      headers: { "Content-Type": "application/json" }
  };
  var pAlias = req.params.projectAlias;
  //console.log("update" + pAlias);
  client.put("http://localhost:3030/projects/"+ pAlias, args,
      function (jsonData, response) {
          // parsed response body as js object
          //console.log(jsonData);
          // raw response
          // console.log(response);

          res.redirect('/admin/projects/'+ pAlias);
      });

});

router.get('/projects/:projectAlias/delete', function (req, res) {
  //var data = req.body;
// console.log(JSON.stringify(data));
 var args = {
     headers: { "Content-Type": "application/json" }
 };
 var pAlias = req.params.projectAlias;
 //console.log(pAlias);
 //console.log("update" + pAlias);
 client.delete("http://localhost:3030/projects/"+ pAlias, args,
     function (jsonData, response) {
         // parsed response body as js object
         console.log(jsonData);
         // raw response
         // console.log(response);
         res.redirect('/admin/projects');
     });

});

router.get('/projects/:projectAlias/upload', function (req, res) {
  var pAlias = req.params.projectAlias;
  res.render('admin/upload', { 
    layout: 'layout-admin', 
    title: 'Upload Cover Image',
    navProjects: true,
    actionUrl: '/admin/projects/'+ pAlias+ '/upload'
  });
});

router.post('/projects/:projectAlias/upload', function (req, res, next) {
  var pAlias = req.params.projectAlias;
  var dir = path.join(__dirname, '../public/projects/'+ pAlias+ '/images');
  var finishUpload = function (err, data){
    if(err){
      //throw new Error('errro...');
      console.log(err)
      res.render('404');
    }else{
      res.redirect('/admin/projects/' + pAlias);
    }
  };

  var callback = function(error, data){
    if(error){
      console.log(error);
    }else{
      //projectService.update(pAlias, { image: '/images/projects/'+ pAlias + '.png'}, finishUpload);
      var args = {
        data: { image: '/images/projects/'+ pAlias + '.png'},
        headers: { "Content-Type": "application/json" }
    };
    client.put("http://localhost:3030/projects/"+ pAlias, args,
      function (jsonData, response) {
          res.redirect('/admin/projects/'+ pAlias);
      });
 
    }
  };  
  mediaService.uploadMedia(req, res, dir, pAlias + '.png', callback);
});

router.get('/media', function (req, res) {
  res.render('admin/upload', { 
    layout: 'layout-admin', 
    title: 'Image Upload',
    //navProjects: true
  });
  });
  



  router.post('/media', function (req, res,next) {
  var dir = path.join(__dirname, '../public/projects/')
  
  mediaService.uploadMedia(req, res, path,alias,callback);
  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
  });








  router.get('/blog', function (req, res, next) {
    client.get("http://localhost:3030/blogs", function (jsonData, response) {
        // parsed response body as js object
        //console.log(jsonData);
        // raw response
        // console.log(response);
        res.render('admin/blog', { 
          layout: 'layout-admin', 
          title: 'Blog Admin',
          navBlog: true,
          blogs:   jsonData.data
        });
    });
});

// router.get('/blog', function (req, res, next) {
//   client.get("http://localhost:3030/blog", function (jsonData, response) {
//         // parsed response body as js object
//         console.log(jsonData.data);
//         // raw response
//         // console.log(response);
//         res.render('blog', { 
//             title: 'Blog', 
//             navBlog: true, 
//             showFooter: true, 
//             extraCss: ['/css/blog.css'],
//             categories: jsonData.categories,
//             blog: jsonData.data
//         });  
//       });
// });

/*
router.get('/blog/:blogAlias', function (req, res, next) {
  client.get("http://localhost:3030/blog/"+ req.params.blogAlias, function (jsonData, response) {
      // parsed response body as js object
      console.log(jsonData.data); 
      res.render('blog-detail', { 
          title: jsonData.data.name ,
          navBlog: true, 
          showFooter: true, 
          extraCss: ['/css/blog.css'],
          blog:  jsonData.data,
          categories: null //blogCategoriesData
          });
      });
});
*/
module.exports = router;