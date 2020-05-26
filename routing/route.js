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
var redis_client = null;

var port_redis = process.env.PORT || 6379;

if(process.env.REDIS_URL){
    redis_client = redis.createClient(process.env.REDIS_URL);
} else {
    redis_client = redis.createClient(port_redis);
}

redis_client.on('error',(err)=>{
    console.log("Error " + err);
});


routing.route('/promote').put((req, res) =>{
    var isPromoted;
    db.promotedFiles(req.body, (flag) =>{
        isPromoted = flag;
        return res.json(isPromoted);
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
        if(data == null) return;
        for(var i=0; i<=data.values.length-1; i++){
            files.keys[i] = Object.keys(data.values[i]);
            files.values[i] = Object.values(data.values[i]);
        }
        jwtToken.verify(token, env.secret, (err,decoded)=>{
            if(!token){
                return res.status(401).json({message:'Token not present'});
            }
            else if(err){
                return res.status(500).json({message:'User not authenticated'});
            } else{
                return res.status(200).json(files);
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
            return res.status(200).send();
        }
    }); 
});

routing.route('/download').get((req, res) => {
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
                    return res.status(401).json({message:'Token not present'});
                }
                else if(err){
                    return res.status(500).json({message:'User not authenticated'});
                } else{
                    if(isAdd){
                        return res.status(200).json(files);
                    } else{
                        return res.status(200).json(deleted);
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
            return res.send(isSaved);
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
                        return res.status(200).send({loggedIn:isValid, user: loggedInUser, token: token});
                    }
                } else {
                    console.log('Password did not match');
                    return res.status(200).send({loggedIn:isValid, user: {}, token: ''});
                    
                }
        }, 2500);
    
    
});

routing.route('/process').post((req, res)=>{

    var data = req.body.data;
    var email = req.body.user;
    var key;
    var value;

    db.updateUserProcess(data,email,(message,processList) =>{

        if(message == "Saved"){
            redis_client.del(email,(err,response) => {
                if(response == 1){
                    console.log("Cache Deleted for ProcessList");
                    key = Object.keys(processList)
                    if(processList[key].process === null || processList[key].process === undefined){

                    }else{
                        values = Object.values(processList[key].process);
                        return res.send({msg:message,list:values});
                    }
                    
                } else {
                    console.log("Could not delete it.");
                    return res.send({msg:message});
                }
            })
        } else {
            return res.send({msg:message});
        }
    });
});


routing.route('/deleteTalk/:fileName').delete((req, res) => {
    var name = req.params.fileName;
    name = decodeURI(name);
    console.log(name);
    db.removeDashboardFile(name, (deleted) => {
        if(deleted){
            return res.status(200).send(deleted);
        } else {
            return res.status(404).send(deleted);
        } 
    })
});

routing.route('/processList/:email').get((req, res) => {

    var email = req.params.email;
    var key;
    var values;
    var flag = false;
    token = req.headers['x-access-token'];
    // console.log(email + 'inside routing');

     redis_client.get(email,(err, process_list)=>{
        if(process_list){
            console.log("I am inside process exists in cache block");
            return res.send(process_list);
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
                                return res.json({message:'Token not present'});
                            }
                            else if(err){
                                return res.json({message:'User not authenticated'});
                            } else{
                                return res.json(values);
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
                return res.status(200).send(isSet);
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
        return res.status(200).send();
    });
});


routing.route('/getUserProfile/:email').get((req,res) => {

    const email = req.params.email;
    var obj = {};
    token = req.headers['x-access-token'];

    redis_client.get(email+'-profile',(err, profile) => {
        if(profile){
            return res.status(200).send(profile);
        } else{
            db.getUserDetails(email, (user) => {
                if(user != null){
                    
                    obj = user;
                    redis_client.setex(email+'-profile',3600,JSON.stringify(obj));
                    jwtToken.verify(token, env.secret, (err,decoded)=>{
                        if(!token){
                            return res.status(401).json({message:'Token not present'});
                        }
                        else if(err){
                            return res.status(500).json({message:'User not authenticated'});
                        } else{
                            return res.status(200).json(obj);
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
                    if(saved){
                        redis_client.del(req.body.email+'-profile',(err,response) => {
                            if(response == 1){
                                console.log("Cache Deleted for UserProfile");
                                return res.status(200).send(saved);
                                
                            } else {
                                console.log("Could not delete it.");
                                return res.status(200).send(saved);
                            }
                        })
                    }
                });

    } else {
        crypt.genSalt(salt, (err, salt) => {
            crypt.hash(req.body.pwd, salt, (err, hash) => {
                req.body.pwd = hash;
                db.updateUserProfile(req.body, (saved) => {
                    if(saved){
                        redis_client.del(req.body.email+'-profile',(err,response) => {
                            if(response == 1){
                                console.log("Cache Deleted for UserProfile");
                                return res.status(200).send(saved);
                                
                            } else {
                                console.log("Could not delete it.");
                                return res.status(200).send(saved);
                            }
                        })
                    }
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
    

});

routing.route('/notifyAll').post((req,res)=>{

    db.manageNotifications(req.body,(result)=>{
        return res.status(200).send({message:'saved'});
    });

});

routing.route('/getAlerts').get((req,res) =>{
   var values;
   token = req.headers['x-access-token'];
        jwtToken.verify(token, env.secret, (err,decoded)=>{
            if(!token){
                return res.status(401).json({message:'Token not present'});
            } else if(err){
                 return res.status(500).json({message:'User not authenticated'});
            } else{
                db.fetchNotifications((alerts) => {
                    values = alerts;
                }); 
            }
        });     
    setTimeout(()=>{
        var results;
        if(values === null || values === undefined){
            return res.status(401).json(values);
        } else{
            results = Object.values(values);
            return res.status(200).json(results);
        }
    },500)
});

routing.route('/update/notification/:username').delete((req,res) => {

    var username = req.params.username;
    var fileName = req.headers['file_name'];
    console.log('User: '+username+' File is: '+fileName);
    db.updateNotificationForUser(fileName,username,(response) => {
        if(response){
            return res.status(200).send({status:200});
        } else {
            return res.status(401).send({status:401});
        }
    }); 
});

module.exports = routing;
