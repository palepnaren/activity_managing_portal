import { AudioService } from './../service/audio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, AfterContentInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';
import { PushNotificationsService } from 'ng-push';

@Component({
  selector: 'app-shared-talks',
  templateUrl: './shared-talks.component.html',
  styleUrls: ['./shared-talks.component.less']
})
export class SharedTalksComponent implements OnInit, AfterViewInit {

  // listOfTalks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  lengthOfItems = 0;
  talksGroup: FormGroup;
  fileType;
  file;
  fileName;
  fileData;
  unit8Array: Uint8Array;
  listOfTalks = [];
  audios;
  len;
  refresh: boolean = true;
  uploadResponse = {
    status: '',
    upload: 0
  };
  i;
  constructor(private builder: FormBuilder, private service: AudioService, private notification: PushNotificationsService) {
    this.talksGroup = this.builder.group({
      file_name: ['', [Validators.required, Validators.maxLength(30)]],
      file: ['', Validators.required]
    });

  }

  ngOnInit() {

   
  }


  ngAfterViewInit() {
     setTimeout(() => {
      this.fileDownload();
     }, 500);

     setTimeout(() => {
      document.addEventListener('play', (e) => {
        this.audios = document.getElementsByTagName('audio');
        for (this.i = 0, this.len = this.audios.length; this.i < this.len; this.i++) {
            if (this.audios[this.i] !== e.target) {
                this.audios[this.i].pause();
            }
        }
      }, true);
      $('loader').css({'display':'none'});
     }, 1501);
 
  }

getFile(e) {

    e.preventDefault();

    this.file = e.target.files[0];
    this.fileName = this.file.name;
    const index = this.fileName.lastIndexOf('.');
    this.fileType = this.fileName.substr(index);
    console.log(this.file.size);

    // if (this.fileType === '.mp3' || this.fileType === '.ogg' || this.fileType === '.wav') {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.fileData = reader.result;
      this.unit8Array = new Uint8Array(this.fileData);
      console.log(this.unit8Array);
    });

    reader.readAsArrayBuffer(this.file);
    // }

  }

   fileUpload(name) {
 
    $('loader').css({'display':'block'});

    let options = {
      body: "File:"+name+" Uploaded by "+sessionStorage.getItem('name'),
      icon: "https://i.imgur.com/vt1Bu3m.jpg"
    }

    // if (this.fileType === '.mp3' || this.fileType === '.ogg' || this.fileType === '.wav' || this.fileType === '.m4a') {

      this.service.fileUpload(name, this.unit8Array).subscribe(res => {

        this.refresh = false;

        this.uploadResponse.status = res.status;
        this.uploadResponse.upload = res.upload;
        // $('loader').css({'display':'none'});
        console.log(res);

        if (this.uploadResponse.status === 'complete' || this.uploadResponse.upload === 100) {
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
        $('loader').css({'display':'none'});
      });

  }

fileDownload() {


  $('loader').css({'display':'block'});
   this.service.fileDownload().subscribe(file => {
     // tslint:disable-next-line:prefer-for-of
     for (this.i = 0; this.i < Object.keys(file).length; this.i++) {
        if(this.listOfTalks.findIndex(fileDetails => fileDetails.name == file[this.i].name.split('/')[1]) >=0){
          console.log("File Details matched");
          console.log(this.listOfTalks);
        } else {
          this.listOfTalks.push({name: file[this.i].name.split('/')[1], url: file[this.i]._url});
        }
        
     }
     this.lengthOfItems = this.listOfTalks.length;
     $('loader').css({'display':'none'});
     this.refresh = true;
   });

}

get f() {
    return this.talksGroup.controls;
  }

}
