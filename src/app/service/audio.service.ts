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
    name: undefined,
    content: undefined
  };
  constructor(private http: HttpClient) { }

  fileUpload(name, data) {
    // console.log(formData);
    this.data.name = name;
    this.data.content = data;
    const url = window.location.origin + '/file';
    return this.http.post(url, this.data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

      switch (event.type) {
        case HttpEventType.UploadProgress:
              const progress = Math.round(100 * event.loaded / event.total);
              return {status: 'progress', upload: progress};
        case HttpEventType.Response:
              return {status: 'complete', upload: progress};
        default:
            return {status: '', upload: null};
      }
    }));
  }

  fileDownload() {
    const url = window.location.origin +  '/download';

    // tslint:disable-next-line:no-shadowed-variable
    return this.http.get(url).map(file => file);
  }

  audioPromotion(data) {
    const url = window.location.origin +  '/promote';
  }
}
