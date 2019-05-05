import { AudioService } from './../service/audio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-shared-talks',
  templateUrl: './shared-talks.component.html',
  styleUrls: ['./shared-talks.component.less']
})
export class SharedTalksComponent implements OnInit {

  listOfTalks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  lengthOfItems = this.listOfTalks.length;
  talksGroup: FormGroup;
  fileType;
  file;
  fileName;
  fileData;
  uploadResponse = {};
  constructor(private builder: FormBuilder, private service: AudioService) {
    this.talksGroup = this.builder.group({
      file: ['', Validators.required]
    });
  }

  ngOnInit() {

    // this.uploadResponse[message] = 0;
  }

getFile(e) {

    e.preventDefault();

    this.file = e.target.files[0];
    this.fileName = this.file.name;
    const index = this.fileName.lastIndexOf('.');
    this.fileType = this.fileName.substr(index);

    // this.talksGroup.get('file').setValue(this.file);

    // console.log(this.fileName);
    // console.log(this.fileType);

    if (this.fileType === '.mp3') {
      const reader = new FileReader();
      const file = new File([this.file], this.fileName, {
        type: 'audio/mp3',
      });
      console.log(file.size);
      reader.addEventListener('load', () => {
      this.fileData = reader.result;
      console.log(this.fileData);
    });

      reader.readAsBinaryString(this.file);
    }

  }

fileUpload() {

    if (this.fileType === '.mp3') {

      const formData = new FormData();
      formData.append('file', this.talksGroup.get('file').value);

      console.log(formData.get('file'));
      this.service.fileUpload(formData, this.fileData).subscribe(res => {
        // console.log(res.message);
        this.uploadResponse = res;
      }, err => {
        console.log(err);
      });

    } else {
      alert('Please choose mp3 file type only');
    }
    setTimeout(() => {
      $('#progress-bar').hide().fadeOut();
    }, 2000);

  }

  get f() {
    return this.talksGroup.controls;
  }

}
