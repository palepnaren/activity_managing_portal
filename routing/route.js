var express = require('express');
var app = express();
var routing = express.Router();
var db = require('../db/db.js');
var crypt = require('bcrypt');
var jwtToken = require('jsonwebtoken');
var env = require('../src/environments/environment.prod.js');
const redis = require('redis');

var file;
var files = [];
var count;
var flag;
var max_count = 0;
var _url;
var token;
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

var port_redis = process.env.PORT || 6379;

const redis_client = redis.createClient(port_redis);

redis_client.on('error',(err)=>{
    console.log("Error " + err);
});


routing.route('/promote').put((req, res) =>{
    var isPromoted;
    db.promotedFiles(req.body, (flag) =>{
        isPromoted = flag;
        res.json(isPromoted);
    });
});

routing.route('/getPromoted').get((req, res) => {
    // console.log(req.session.loggedIn);
    var files = {
        keys: [],
        values: []
    }
    token = req.headers['x-access-token'];
    db.getPromoted((data) => {
        for(var i=0; i<=data.values.length-1; i++){
            files.keys[i] = Object.keys(data.values[i]);
            files.values[i] = Object.values(data.values[i]);
        }
        jwtToken.verify(token, env.secret, (err,decoded)=>{
            if(!token){
                res.status(401).json({message:'Token not present'});
            }
            else if(err){
                res.status(500).json({message:'User not authenticated'});
            } else{
                res.status(200).json(files);
            }
        });
    });
});

routing.route('/file').post((req, res) => {
    file = req.body.name;
    data = req.body.content;
    console.log(file);
    db.saveFile(file, data, flag => {
        if(flag){
            res.status(200).send();
        }
    }); 
});

routing.route('/download').get((req, res) => {
    console.log("Files downloading");
    console.log(req.headers['x-access-token']);
    token = req.headers['x-access-token'];
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
                            // console.log(file.name);
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
            jwtToken.verify(token, env.secret, (err,decoded)=>{
                if(!token){
                    res.status(401).json({message:'Token not present'});
                }
                else if(err){
                    res.status(500).json({message:'User not authenticated'});
                } else{
                    if(isAdd){
                        res.status(200).json(files);
                    } else{
                        res.status(200).json(deleted);
                    }
                    
                }
            });
            
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
            user.pwd = hashed;
            user.role = req.body.role;
            user.upline = req.body.upline;
            user.date = Date.now().toString();
            isSaved = db.saveUser(user);
            res.send(isSaved);
        });
    });

    // setTimeout(()=>{
    //     user.pwd = hashed;
    // }, 10000);

    // user.role = req.body.role;
    // user.upline = req.body.upline;
    // user.date = Date.now().toString();

    // setTimeout(() =>{
    //     isSaved = db.saveUser(user);
    //     res.send(isSaved);
    // }, 13000);
    
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
        upline: '',
        profileImage: ''
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
                    token = jwtToken.sign({userID: isUser.email}, env.secret, {expiresIn: '1h'});
                });
            } 
        } 
        
    });

        setTimeout(() => {
                if(token){
                    if(isUser != null || isUser != undefined){
                        loggedInUser.fullName = isUser.fname+ ' ' + isUser.lname;
                        loggedInUser.username = isUser.username;
                        loggedInUser.role = isUser.role;
                        loggedInUser.upline = isUser.upline;
                        loggedInUser.profileImage = isUser.profileImage;
                        res.status(200).send({loggedIn:isValid, user: loggedInUser, token: token});
                    }
                } else {
                    res.status(200).send({loggedIn:isValid, user: {}, token: ''});
                    console.log('Password did not match');
                }
        }, 2500);
    
    
});

routing.route('/process').post((req, res)=>{

    var data = req.body.data;
    var email = req.body.user;

    db.updateUserProcess(data,email,(process) =>{

        if(process == "Saved"){
            res.status(200).send({msg:process});
        } else {
            res.status(404).send({msg:process});
        }
    });
});


routing.route('/deleteTalk/:fileName').delete((req, res) => {
    var name = req.params.fileName;
    name = decodeURI(name);
    console.log(name);
    db.removeDashboardFile(name, (deleted) => {
        if(deleted){
            res.status(200).send(deleted);
        } else {
            res.status(404).send(deleted);
        } 
    })
});

routing.route('/processList/:email').get((req, res) => {

    var email = req.params.email;
    var key;
    var values;
    token = req.headers['x-access-token'];
    // console.log(email + 'inside routing');

    redis_client.get(email,(err, process_list)=>{
        if(process_list){
            console.log("I am inside process exists in cache block");
            // console.log(process_list);
            res.status(200).send(process_list);
        } else{
            console.log("I am inside process does not exists in cache block");
            db.getProcess(email, (list) => {

                if(list === null || list === undefined){
            
                } else {
                    key = Object.keys(list);
            
                    if(list[key].process === null || list[key].process === undefined){
            
                    } else {
                        values = Object.values(list[key].process);
                        redis_client.setex(email,3600,JSON.stringify(values));
                        jwtToken.verify(token, env.secret, (err,decoded)=>{
                            if(!token){
                                res.status(401).json({message:'Token not present'});
                            }
                            else if(err){
                                res.status(500).json({message:'User not authenticated'});
                            } else{
                                res.status(200).json(values);
                            }
                        });
                    }  
                }    
                });
        }
    });

});

routing.route('/updatePassword').post((req, res) => {
    var email = req.body.email;
    var isSet;
    var pwd;
    crypt.genSalt(salt, (err, salt) => {
        crypt.hash(req.body.pwd, salt, (err, hash) => {
            hashed = hash;
            pwd = hashed;
            db.forgotPwd(email, pwd, (flag) => {
                isSet = flag;
                console.log("Password updated: "+isSet);
                res.status(200).send(isSet);
            });  
        });
    }); 
});

routing.route('/destroy').get((req,res) =>{
    req.session.loggedIn = false;
    isValid = false;
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        console.log("Session has been destroyed");
        res.status(200).send();
    });
});


routing.route('/getUserProfile/:email').get((req,res) => {

    const email = req.params.email;
    var obj = {};
    token = req.headers['x-access-token'];

    redis_client.get(email+'-profile',(err, profile) => {
        if(profile){
            res.status(200).send(profile);
        } else{
            db.getUserDetails(email, (user) => {
                if(user != null){
                    
                    obj = user;
                    redis_client.setex(email+'-profile',3600,JSON.stringify(obj));
                    jwtToken.verify(token, env.secret, (err,decoded)=>{
                        if(!token){
                            res.status(401).json({message:'Token not present'});
                        }
                        else if(err){
                            res.status(500).json({message:'User not authenticated'});
                        } else{
                            res.status(200).json(obj);
                        }
                    });
                    
                } else {
                    console.log("User not found");
                }
            });
        }
    });
 

});

routing.route('/updateProfile').post((req, res) => {

    
    if(req.body.pwd === '' || req.body.pwd === null || req.body.pwd === undefined){
                db.updateUserProfile(req.body, (saved) => {
                    // console.log(saved);
                    res.status(200).send(saved);
                });

    } else {
        crypt.genSalt(salt, (err, salt) => {
            crypt.hash(req.body.pwd, salt, (err, hash) => {
                req.body.pwd = hash;
                db.updateUserProfile(req.body, (saved) => {
                    // console.log(saved);
                    res.status(200).send(saved);
                });
            });
        });
    }

    // setTimeout(() => {
    //     db.updateUserProfile(req.body, (saved) => {
    //         console.log(saved);
    //         res.send(saved);
    //     });
    // },10000);
    

})




module.exports = routing;