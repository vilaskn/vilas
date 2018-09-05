var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();

router.get('/', function (req, res, next) {
    client.get("http://localhost:3030/projects", function (jsonData, response) {
        // parsed response body as js object
        console.log(jsonData);
        // raw response
        // console.log(response);
        res.render('projects', { 
            title: 'projects', 
            navProjects: true, 
            showFooter: true, 
            projects: jsonData.data
        });
    });
});

router.get('/:projectAlias', function (req, res, next) {
    client.get("http://localhost:3030/projects/"+ req.params.projectAlias, 
        function (jsonData, response) {
            // parsed response body as js object
            console.log(jsonData);
            // raw response
            // console.log(response);

            res.render('project-detail', { 
                title: jsonData.data.name ,
                navProjects: true, 
                showFooter: true, 
                project:  jsonData.data
            });
        });
});


  
router.get('/:projectAlias/demo', function (req, res, next) {
    client.get("http://localhost:3030/projects/"+ req.params.projectAlias, 
    function (jsonData, response) {
        // parsed response body as js object
//        console.log(jsonData);
        // raw response
        // console.log(response);
        res.render('demo', { 
            layout: 'layout-demo',
            title: jsonData.name,
        });
    });
});

module.exports = router;