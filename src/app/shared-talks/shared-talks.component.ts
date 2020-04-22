import { AudioService } from './../service/audio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, AfterContentInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';
import { PushNotificationsService } from 'ng-push';
import { PaginationComponent } from '../pagination/pagination.component';
import { UserService } from '../service/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shared-talks',
  templateUrl: './shared-talks.component.html',
  styleUrls: ['./shared-talks.component.less']
})
export class SharedTalksComponent implements OnInit, AfterViewInit {

  
  lengthOfItems = 0;
  talksGroup: FormGroup;
  fileType;
  file;
  fileName: string = "Audio files";
  fileData;
  unit8Array: Uint8Array;
  listOfTalks = [];
  audios;
  len;
  alerts:any = [];
  newAlerts:any = [];
  uploadResponse = {
    status: '',
    upload: 0
  };
  i;
  notificationObject:any = {};
  constructor(private builder: FormBuilder, private service: AudioService, private notification: PushNotificationsService,
     private pagination: PaginationComponent, private userService: UserService, private router:ActivatedRoute, private route:Router) {
    this.talksGroup = this.builder.group({
      file_name: ['', [Validators.required, Validators.maxLength(30)]],
      file: ['', [Validators.required]]
    });

    
    
  }

  ngOnInit() {
    $('loader').show();
   
  }


  ngAfterViewInit() {
    $('loader').hide();
      this.fileDownload();

     document.addEventListener('play', (e) => {
      this.audios = document.getElementsByTagName('audio');
      for (this.i = 0, this.len = this.audios.length; this.i < this.len; this.i++) {
          if (this.audios[this.i] !== e.target) {
              this.audios[this.i].pause();
          }
      }
    }, true);
 
  }

getFile(e) {

    e.preventDefault();

    this.file = e.target.files[0];
    this.fileName = this.file.name;
    const index = this.fileName.lastIndexOf('.');
    this.fileType = this.fileName.substr(index);
    console.log(this.file.size);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.fileData = reader.result;
      this.unit8Array = new Uint8Array(this.fileData);
      console.log(this.unit8Array);
    });

    reader.readAsArrayBuffer(this.file);

}

   fileUpload(name) {
 
    $('loader').show();

    let options = {
      body: "File:"+name+" Uploaded by "+sessionStorage.getItem('name'),
      icon: sessionStorage.getItem("profileImage")
    }

    

      this.service.fileUpload(name, this.unit8Array).subscribe(res => {

        if(res){
          this.notificationObject = {
            name: sessionStorage.getItem('name'),
            image: sessionStorage.getItem('profileImage'),
            file_name: name,
            email: sessionStorage.getItem('email'),
            label: 'new',
            users:[],
            posted: Date.now()
          }
        }

        $('pagination').hide();

        this.uploadResponse.status = res.status;
        this.uploadResponse.upload = res.upload;
        // $('loader').css({'display':'none'});
        console.log(res);
        ;

        if (this.uploadResponse.status === 'complete' || this.uploadResponse.upload === 100) {
          this.talksGroup.reset();
          // this.fileName = 'Audio files';
          $('#progress-bar').hide().fadeOut();
          console.log("File Upload is done");
          this.notification.create("File Upload", options).subscribe(res => {
            this.fileDownload();
          }, err => {
            console.log(err);
          });
        } 

      }, err => {
        console.log(err);
        $('loader').hide();
      });
      if(this.notificationObject == null || this.notificationObject == undefined || this.notificationObject == {}){

      } else {
        this.service.notificationService(this.notificationObject).subscribe(res => {
          console.log(res);
        });
      }
      this.fileName = 'Audio files';

  }

fileDownload() {
  $('loader').show();
   this.service.fileDownload().subscribe(file => {
     // tslint:disable-next-line:prefer-for-of
     for (this.i = 0; this.i < Object.keys(file).length; this.i++) {
        if(this.listOfTalks.findIndex(fileDetails => fileDetails.name == file[this.i].name.split('/')[1]) >=0){
         
        } else {
          this.listOfTalks.push({name: file[this.i].name.split('/')[1], url: file[this.i]._url});
        }
        
     }
     this.lengthOfItems = this.listOfTalks.length;

     if(this.route.url.indexOf('query') > -1){
        this.router.queryParams.subscribe(params => {
          console.log(params.query);
          this.searching(params.query);
        });
     }
     
     $('loader').hide();
     $('pagination').show();
   });

}

searching(keyword:string){
  
  if(keyword === null || keyword === undefined || keyword === ''){

    this.listOfTalks = [];
    this.fileDownload();

  } else{
    this.listOfTalks = this.listOfTalks.filter(talk => talk.name.toLowerCase().includes(keyword.toLowerCase()));
    console.log(this.listOfTalks);
    this.lengthOfItems = this.listOfTalks.length;
    this.pagination.listOfItems = this.listOfTalks;
    this.pagination.lengthOfList = this.lengthOfItems;
  }
  
  
}

refresh(event){
  console.log("Event triggered");
  console.log(event);
  this.listOfTalks = event.items;
  this.lengthOfItems = event.size;
}

get f() {
    return this.talksGroup.controls;
  }

}
