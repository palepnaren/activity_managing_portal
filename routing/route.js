var express = require('express');
var app = express();
var routing = express.Router();
var db = require('../db/db.js');

var file;
var files = [];
var count;
var flag;
var max_count = 0;
var _url;

routing.route('/file').post((req, res) => {
    file = req.body.file;
    data = req.body.content;
    console.log(file);
    db.saveFile(file, data);
});

routing.route('/download').get((req, res) => {
    db.downloadFiles().then(file =>{
        count = file[0].length;
        if(count > max_count){
            max_count = count;
            file[0].forEach(file => {
                file.getSignedUrl({action: 'read', expires: '02-03-2491'}).then(url => {
                    // console.log(url[0]);
                    setTimeout(()=>{
                        console.log(url[0]);
                        files.push({name: file.name, _url: url[0]}); 
                    },100)
                });
            });   
        } 
        setTimeout(()=>{
            res.json(files);
        }, 300);
    });  
});

module.exports = routing;