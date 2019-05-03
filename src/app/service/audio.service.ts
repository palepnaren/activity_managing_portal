import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  data = {
    name: undefined,
    content: undefined
  };
  constructor(private http: HttpClient) { }

  fileUpload(fileName, data) {
    console.log(fileName);
    this.data.name = fileName;
    this.data.content = data;
    const url = 'http://localhost:9500/file';

    this.http.post(url, this.data).subscribe(f => {
      console.log(f);
    });

  }
}
