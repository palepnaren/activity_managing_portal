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

    // $('loader').css({'display':'none'});
    // this.uploadResponse[message] = 0;
  //  window.onload = () => {
  //    this.fileDownload();
  //  };
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

     }, 1501);

     $('loader').css({'display':'none'});
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

    let options = {
      body: "File:"+name+" Uploaded by "+sessionStorage.getItem('name'),
      icon: "https://i.imgur.com/vt1Bu3m.jpg"
    }

    // $('loader').css({'display':'block'});

    // if (this.fileType === '.mp3' || this.fileType === '.ogg' || this.fileType === '.wav' || this.fileType === '.m4a') {

      this.service.fileUpload(name, this.unit8Array).subscribe(res => {

        this.uploadResponse.status = res.status;
        this.uploadResponse.upload = res.upload;
        $('loader').css({'display':'none'});

      }, err => {
        console.log(err);
        $('loader').css({'display':'none'});
      });

      setTimeout(() => {
        if (this.uploadResponse.upload === 100) {
          $('#progress-bar').hide().fadeOut();
          this.notification.create("File Upload", options).subscribe(res => {

          }, err => {
            console.log(err);
          });
          setTimeout(() => {
            this.fileDownload();
          }, 50);
        }
      }, 10000);


  }

fileDownload() {

  $('pagination').css({'display':'none'});

  // $('loader').css({'display':'block'});
   this.service.fileDownload().subscribe(file => {
     // tslint:disable-next-line:prefer-for-of
     for (this.i = 0; this.i < Object.keys(file).length; this.i++) {
        this.listOfTalks.push({name: file[this.i].name.split('/')[1], url: file[this.i]._url});
     }
     this.lengthOfItems = this.listOfTalks.length;
     $('loader').css({'display':'none'});
     setTimeout(() => {
      $('pagination').css({'display':'block'});
     },200)
   });

  }

get f() {
    return this.talksGroup.controls;
  }

}
