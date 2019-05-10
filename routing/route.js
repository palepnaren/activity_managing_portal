var express = require('express');
var app = express();
var routing = express.Router();
var db = require('../db/db.js');
var crypt = require('bcrypt');

var file;
var files = [];
var count;
var flag;
var max_count = 0;
var _url;
var user = {
    fname: '',
    lname: '',
    email: '',
    username: '',
    pwd: '',
    role: '',
    upline: '',
    date: ''
}
var salt = 15;
var isSaved = null;
var hashed = null;
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

routing.route('/save').post((req, res) => {

    user.fname = req.body.firstName;
    user.lname = req.body.lastName;
    user.email = req.body.email;
    user.username = req.body.username;
    
    crypt.genSalt(salt, (err, salt) => {
        crypt.hash(req.body.password, salt, (err, hash) => {
            hashed = hash;
        });
    });

    setTimeout(()=>{
        user.pwd = hashed;
    }, 10000);

    user.role = req.body.role;
    user.upline = req.body.upline;
    user.date = Date.now().toString();

    setTimeout(() =>{
        // console.log(user);
        isSaved = db.saveUser(user);
        res.send(isSaved);
    }, 13000);
    
});

module.exports = routing;