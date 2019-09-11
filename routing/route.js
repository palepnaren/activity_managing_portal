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
var isAdd;
var deleted = [];
var salt = 15;
var isSaved = null;
var hashed = null;
var key = null;
var isValid;
var isUser;

routing.route('/promote').put((req, res) =>{
    var isPromoted;
    db.promotedFiles(req.body, (flag) =>{
        isPromoted = flag;
    });

    setTimeout(()=>{
        res.json(isPromoted);
    }, 200);
});

routing.route('/getPromoted').get((req, res) => {
    console.log(req.session.loggedIn);
    var files = {
        keys: [],
        values: []
    }
    db.getPromoted((data) => {
        for(var i=0; i<=data.values.length-1; i++){
            files.keys[i] = Object.keys(data.values[i]);
            files.values[i] = Object.values(data.values[i]);
        }
    });

    setTimeout(() => {
        if(req.session.loggedIn == true){
            res.json(files);
        } else {
            res.json({message:'Session is destroyed'})
        }
        
    },500);
})

routing.route('/file').post((req, res) => {
    file = req.body.name;
    data = req.body.content;
    console.log(file);
    db.saveFile(file, data);
});

routing.route('/download').get((req, res) => {
    console.log(req.session.loggedIn);
    db.downloadFiles().then(file =>{
        count = file[0].length;
        console.log(count);
        if(count > max_count){
            max_count = count;
            isAdd = true;
            file[0].forEach(file => {
                file.getSignedUrl({action: 'read', expires: '02-03-2491'}).then(url => {
                
                    setTimeout(()=>{
                
                        if(files.findIndex(f => f.name == file.name) >= 0){

                        } else {
                            console.log(file.name);
                            files.push({name: file.name, _url: url[0]}); 
                        }
                    },100)
                });
            });   
        } else if(count < max_count) {
            max_count = count;
            isAdd = false;
            file[0].forEach(file => {
                file.getSignedUrl({action: 'read', expires: '02-03-2491'}).then(url => {
                    
                    setTimeout(()=>{
                        
                        if(deleted.findIndex(f => f.name == file.name) >= 0){

                        } else {
                            
                            deleted.push({name: file.name, _url: url[0]}); 
                        }
                    },100)
                });
            });
        }
        setTimeout(()=>{
            if(isAdd){
                console.log("res " + files.length);
                if(req.session.loggedIn == true){
                    res.json(files);
                } else {
                    res.json({message:'Session is destroyed'});
                }
            } else {
                console.log("res " + deleted.length);
                if(req.session.loggedIn == true){
                    res.json(deleted);
                } else {
                    res.json({message:'Session is destroyed'})
                }
                
            }
            
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
        
        if(authUser === null || authUser === undefined){

        } else {
            key = Object.keys(authUser);
            isUser = authUser[key[0]];
            if((req.body.email === isUser.email || req.body.email === isUser.username)){
                crypt.compare(req.body.pwd, isUser.pwd, (err,  match) => {
                    req.session.loggedIn = match;
                    isValid = match;
                });
            } else {
                isValid = false;
                req.session.loggedIn = false;
                console.log('Password did not match');
            }
        }
        
        
    });

    
        setTimeout(() => {
            if(isUser != null || isUser != undefined){
                loggedInUser.fullName = isUser.fname+ ' ' + isUser.lname;
                loggedInUser.username = isUser.username;
                loggedInUser.role = isUser.role;
                loggedInUser.upline = isUser.upline;
                res.send({loggedIn:isValid, user: loggedInUser});
            }
        }, 3000);
    
    
});

routing.route('/process').post((req, res)=>{

    console.log(req.session.loggedIn);
    var data = req.body.data;
    var email = req.body.user;

    var message = db.updateUserProcess(data,email);

    res.send({msg:message});

});

routing.route('/processList/:email').get((req, res) => {

    var email = req.params.email;
    var key;
    var values;
    console.log(email + 'inside routing');

    db.getProcess(email, (list) => {

    if(list === null || list === undefined){

    } else {
        key = Object.keys(list);

        if(list[key].process === null || list[key].process === undefined){

        } else {
            values = Object.values(list[key].process);
        }  
    }    
    });

    setTimeout(() => {
        if(req.session.loggedIn == true){
            res.send(values);
        } else {
            res.send({message: "Session is destroyed"});
        }
        
    }, 200);

});

routing.route('/updatePassword').post((req, res) => {
    var email = req.body.email;
    var isSet;
    var pwd;

    crypt.genSalt(salt, (err, salt) => {
        crypt.hash(req.body.pwd, salt, (err, hash) => {
            hashed = hash;
        });
    });

    setTimeout(() => {
        pwd = hashed;
    },10000);

   setTimeout(() => {
    db.forgotPwd(email, pwd, (flag) => {
        isSet = flag;
        console.log(isSet);
    });
   },10500)

    setTimeout(() =>{
        console.log(isSet);
        res.send(isSet);
    }, 11000);
    
});

routing.route('/destroy').get((req,res) =>{
    req.session.loggedIn = false;
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
    setTimeout(()=>{
        console.log("Session has been destroyed");
    },200);
});




module.exports = routing;