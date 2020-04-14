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
        cb(true);
    }).catch(err => {
        cb(false);
    });
  
};

exports.removeDashboardFile = (fileName, cb) => {

    // console.log(fileName);

    firebase.database().ref('/promotedTalks').child(fileName).remove().then(success => {
        cb(true);
    }).catch(err =>{
        cb(false);
    });
}

exports.promotedFiles = (fileData, cb) =>{
    var data;
    var key;
    var flag = '';

    firebase.database().ref('/promotedTalks').on('value', (snapshot) =>{
        console.log("promoted talks length: "+Object.keys(snapshot.val()).length);

        if(Object.keys(snapshot.val()).length === 5){
            cb('maxLimit');
        } else {
            firebase.database().ref('/promotedTalks').child(fileData.data.name).on('value', (snapshot) => {

                if(snapshot.exists()){
                    cb('exists')
                } else{
                    console.log('Adding new child')
                    flag = true;
                    key = firebase.database().ref('/promotedTalks').child(fileData.data.name).push(fileData);
                    cb('promoted'); 
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
    firebase.database().ref('/promotedTalks').on('value', (snapshot) => {
        files.keys = Object.keys(snapshot.val());
        files.values = Object.values(snapshot.val());
        // console.log(files);
        cb(files);
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
        cb(data);
    }, (err) => {
        console.log("no details found");
        data = null;
        cb(data);
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
            cb("Saved");
        }).catch(err => {
            cb("Error While saving");
        });
    }, 100);
}

exports.getProcess = (email, cb) => {

    // console.log(email + 'inside db');
    var key;

    db.child('/'+email.split('@')[0]).on('value', (snapshot) => {
        key = Object.keys(snapshot.val());
        cb(snapshot.val());
    }, (err) => {
        cb(null);
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
            cb(true);
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
            cb(obj);
            // console.log(obj);

        } else {
            console.log("User not Found");
            cb(null);
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
            cb(true);
        });
    },100);

}
