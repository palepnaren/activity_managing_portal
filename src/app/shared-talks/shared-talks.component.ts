import { AudioService } from './../service/audio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, AfterContentInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';

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
  uploadResponse = {};
  i;
  constructor(private builder: FormBuilder, private service: AudioService) {
    this.talksGroup = this.builder.group({
      file: ['', Validators.required]
    });
  }

  ngOnInit() {
    // this.uploadResponse[message] = 0;
  //  window.onload = () => {
  //    this.fileDownload();
  //  };
  }


   ngAfterViewInit() {
     setTimeout(() => {
      this.fileDownload();
     }, 500);

  }

   getFile(e) {

    e.preventDefault();

    this.file = e.target.files[0];
    this.fileName = this.file.name;
    const index = this.fileName.lastIndexOf('.');
    this.fileType = this.fileName.substr(index);
    console.log(this.file.size);

    if (this.fileType === '.mp3' || this.fileType === '.ogg' || this.fileType === '.wav') {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
      this.fileData = reader.result;
      this.unit8Array = new Uint8Array(this.fileData);
      console.log(this.unit8Array);
    });

      reader.readAsArrayBuffer(this.file);
    }

  }

   fileUpload() {

    if (this.fileType === '.mp3' || this.fileType === '.ogg' || this.fileType === '.wav') {

      this.service.fileUpload(this.file, this.unit8Array).subscribe(res => {
        // console.log(res.message);
        this.uploadResponse = res;
      }, err => {
        console.log(err);
      });

    } else {
      alert('Please choose mp3/ogg/wav file type only');
    }

    setTimeout(() => {
        $('#progress-bar').hide().fadeOut();
    }, 10000);

  }

   fileDownload() {
   this.service.fileDownload().subscribe(file => {
     // tslint:disable-next-line:prefer-for-of
     for (this.i = 0; this.i < Object.keys(file).length; this.i++) {
        this.listOfTalks.push({name: file[this.i].name.split('/')[1], url: file[this.i]._url});
     }
     this.lengthOfItems = this.listOfTalks.length;
   });
  }

   get f() {
    return this.talksGroup.controls;
  }

}
