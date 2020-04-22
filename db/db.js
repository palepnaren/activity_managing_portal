var firebase = require('firebase-admin');
var chalk = require('chalk');
var fs = require('fs');
const rawdata = fs.readFileSync('firebase.json');
const serviceAccount = JSON.parse(rawdata);



firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL:'https://team-portal-dd915.firebaseio.com',
    storageBucket:'gs://team-portal-dd915.appspot.com'
});


// fire.initializeApp(firebaseConfig);


 var bucket = firebase.storage().bucket();
 var db = firebase.database().ref('/users');
 var notifications = firebase.database().ref('/notificationSystem');
 var talks = firebase.database().ref('/promotedTalks');
 var flag;

//creating a file and saving some date to it.

exports.saveFile = (name, data,cb) => {
  
    // const index = name.lastIndexOf('\\');
    // name = name.substr(index + 1);

   console.log(name);
   data = Object.values(data);
   var buffer = Buffer.from(data);
   //console.log(buffer);
   
    bucket.file('/audio/'+name).save(buffer,{contentType:'audio/mp3'}).then(() => {
        console.log("File pushed onto server ");
        return cb(true);
    }).catch(err => {
        return cb(false);
    });
  
};

exports.removeDashboardFile = (fileName, cb) => {

    // console.log(fileName);

    talks.child(fileName).remove().then(success => {
        return cb(true);
    }).catch(err =>{
        return cb(false);
    });
}

exports.promotedFiles = (fileData, cb) =>{
    var data;
    var key;
    var flag = '';

    talks.on('value', (snapshot) =>{
        // if(snapshot.exists())
        console.log("promoted talks length: "+Object.keys(snapshot.val()).length);

        if(Object.keys(snapshot.val()).length === 5){
            return cb('maxLimit');
        } else {
            talks.child(fileData.data.name).on('value', (snapshot) => {

                if(snapshot.exists()){
                    return cb('exists')
                } else{
                    console.log('Adding new child')
                    flag = true;
                    key = talks.child(fileData.data.name).push(fileData);
                    return cb('promoted'); 
                }
            }); 
        }
    });
    
      
}

exports.getPromoted = (cb) => {
    var files = {
        keys: [],
        values: []
    }
    talks.on('value', (snapshot) => {
        if(snapshot.exists()){
            files.keys = Object.keys(snapshot.val());
            files.values = Object.values(snapshot.val());
            // console.log(files);
            return cb(files);
        } else {
            return cb(null);
        }
        
    });
}

exports.downloadFiles = () =>{
    return bucket.getFiles();
};

exports.saveUser = (user) =>{

    // will be usefull to check if username is valid or unique.
    // db.child('/usernames').push(user.username);

    var key = db.child('/'+user.email.split('@')[0]).push(user);

    if(key != null){
        flag = true;
    } else {
        flag = false ;
    }

    return flag; 
};


exports.authUser = (user, cb) => {
    var data;
    db.child('/'+user.email.split('@')[0]).on('value', (snapshot) => {
        data = snapshot.val();
        return cb(data);
    }, (err) => {
        console.log("no details found");
        data = null;
        return cb(data);
    });
}

exports.updateUserProcess = (obj, email, cb) => {
    var key;
    var msg;

    db.child('/'+email.split('@')[0]).on('value', (snapshot) => {
        key = Object.keys(snapshot.val());  
    });

    setTimeout(() => {
        db.child('/'+email.split('@')[0]+'/'+key).child('process').push().set(obj).then(success =>{
            return cb("Saved");
        }).catch(err => {
            return cb("Error While saving");
        });
    }, 100);
}

exports.getProcess = (email, cb) => {

    // console.log(email + 'inside db');
    var key;

    db.child('/'+email.split('@')[0]).on('value', (snapshot) => {
        key = Object.keys(snapshot.val());
        return cb(snapshot.val());
    }, (err) => {
        return cb(null);
    });
}

exports.forgotPwd = (email, newPwd, cb) => {
    var key;
    var flag;
    db.child('/'+email.split('@')[0]).on('value', (snapshot) => {
        key = Object.keys(snapshot.val());
    });

    setTimeout(() => {
        db.child('/'+email.split('@')[0]+'/'+key).update({pwd:newPwd}, (success) => {
            return cb(true);
        }); 
    },100); 
    
}


exports.getUserDetails = (email, cb) => {

    var obj = {
        email: '',
        fname: '',
        lname: '',
        role: '',
        upline: '',
        username: '',
        address: '',
        city: '',
        state: '',
        profileImage: ''
    };
    var array = [];
    db.child('/'+email.split('@')[0]).on('value', (snapshot) => {
        if(snapshot.exists()){
            array = Object.values(snapshot.val());
            obj.email = array[0].email;
            obj.fname = array[0].fname;
            obj.lname = array[0].lname;
            obj.role = array[0].role;
            obj.upline = array[0].upline;
            obj.username = array[0].username;
            obj.address = array[0].address;
            obj.city = array[0].city;
            obj.state = array[0].state;
            obj.profileImage = array[0].profileImage;
            return cb(obj);
            // console.log(obj);

        } else {
            console.log("User not Found");
            return cb(null);
        }
        
    });
}

exports.updateUserProfile = (user, cb) => {
    var key;
    var msg;
    var obj = {};
    // console.log(user);
    db.child('/'+user.email.split('@')[0]).on('value', (snapshot) => {
        key = Object.keys(snapshot.val());
    });
    setTimeout(() => {
        
        if(user.pwd === null || user.pwd === undefined || user.pwd === ''){
            obj.email = user.email;
            obj.fname = user.fname;
            obj.lname = user.lname;
            obj.role = user.role;
            obj.address = user.address;
            obj.city = user.city;
            obj.state = user.state;
            obj.profileImage = user.profileImage;
        } else {
            obj.email = user.email;
            obj.fname = user.fname;
            obj.lname = user.lname;
            obj.role = user.role;
            obj.address = user.address;
            obj.city = user.city;
            obj.state = user.state;
            obj.profileImage = user.profileImage;
            obj.pwd = user.pwd;
        }

        db.child('/'+user.email.split('@')[0]+'/'+key).update(obj, (success) => {
            return cb(true);
        });
    },100);

}

exports.manageNotifications = (object,cb) =>{

    notifications.child('/'+object.file_name).push().set(object).then(success => {
        return cb(success);
    });

}

exports.fetchNotifications = (cb) =>{
    notifications.on('value',(alerts) => {
        if(alerts.exists()){
            return cb(alerts.val());
        } else{
           return cb(null);
        }
    });
}

exports.updateNotificationForUser = (file_name, username,cb) => {

    var _users = [];
    var key;
    var values;
    notifications.child('/'+file_name).on('value',(snapshot) => {
        key = Object.keys(snapshot.val());
        values = Object.values(snapshot.val());
        if(snapshot.exists()){
            for(var i=0; i<values.length; i++){
                if(values[i].users != null || values[i].users != undefined){
                    for(var j=0; j<values[i].users.length;j++){
                        _users.push(values[i].users[j]);
                    }
                    if(Object.values(values[i].users).indexOf(username) > -1){
                        console.log("You have already seen the alert.")
                    } else {
                        _users.push(username);
                        notifications.child('/'+file_name).child('/'+key).update({users:_users},(err) => {
                            if(err){
                                return cb(false);
                            }
                                return cb(true);
                        });
                    }
                } else {
                        _users.push(username);
                        notifications.child('/'+file_name).child('/'+key).update({users:_users},(err) => {
                            if(err){
                                return cb(false);
                            }
                                return cb(true);
                        });
                } 
            } 
        }
    });
}

