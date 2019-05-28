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
var key = null;
var isValid;
var isUser;
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
                        // console.log(url[0]);
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

routing.route('/auth').post((req, res) => {
    req.session.user = req.body.email;
    const user = {
        email: req.body.email,
        pwd: req.body.pwd
    }
    var loggedInUser = {
        fullName: '',
        username: '',
        role: '',
        upline: ''
    }
    
    // console.log(req.session.user);
    
    db.authUser(user, (authUser) => {
        
        key = Object.keys(authUser);
        isUser = authUser[key[0]];
        if((req.body.email === isUser.email || req.body.email === isUser.username)){
            crypt.compare(req.body.pwd, isUser.pwd, (err,  match) => {
                isValid = match;
                // console.log(isValid);
            });
        } else {
            isValid = false;
        }
    });

    setTimeout(() => {
        loggedInUser.fullName = isUser.fname+ ' ' + isUser.lname;
        loggedInUser.username = isUser.username;
        loggedInUser.role = isUser.role;
        loggedInUser.upline = isUser.upline;
        res.send({loggedIn:isValid, user: loggedInUser});
    }, 3000);
    
});

routing.route('/process').post((req, res)=>{

    var data = req.body.data;
    var email = req.body.user;

    var message = db.updateUserProcess(data,email);

    res.send({msg:message});

});

module.exports = routing;