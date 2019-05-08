import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
// import { map } from 'rxjs-compat/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  data = {
    file: undefined,
    content: undefined
  };
  constructor(private http: HttpClient) { }

  fileUpload(file, data) {
    // console.log(formData);
    this.data.file = file.name;
    this.data.content = data;
    const url = 'http://localhost:9500/file';
    return this.http.post(url, this.data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

      switch (event.type) {
        case HttpEventType.UploadProgress:
              const progress = Math.round(100 * event.loaded / event.total);
              return {status: 'progress', upload: progress};
        case HttpEventType.Response:
              return event.body;
        default:
            return `Unhandled event: ${event.type}`;
      }
    }));
  }

  fileDownload() {
    const url = 'http://localhost:9500/download';

    // tslint:disable-next-line:no-shadowed-variable
    return this.http.get(url).map(file => file);
  }
}
