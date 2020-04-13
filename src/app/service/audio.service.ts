import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
// import { map } from 'rxjs-compat/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  isNewAudio = {
    audioName: '',
    personName: '',
    profilePic: ''
  }

  data = {
    name: undefined,
    content: undefined
  };
  private headers: HttpHeaders;
  
  constructor(private http: HttpClient) { 
    // console.log(sessionStorage.getItem('access-token'));
  }

  fileUpload(name, data) {
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
              return {status: 'complete', upload: 100};
        default:
            return {status: '', upload: null};
      }
    }));
  }

  fileDownload() {
    this.headers = new HttpHeaders();
    const token = sessionStorage.getItem('access-token');
    this.headers = this.headers.set('x-access-token', token);
    this.headers = this.headers .set('content-type', 'application/json')
    this.headers = this.headers .set('Access-Control-Allow-Origin', '*')
    console.log(this.headers);
    const url = window.location.origin +  '/download';
    

    // tslint:disable-next-line:no-shadowed-variable
    console.log(this.headers.get('x-access-token'));
    return this.http.get(url,{headers: this.headers}).map(file => file);
  }

  audioPromotion(data) {
    const url = window.location.origin +  '/promote';
    return this.http.put(url, data).map(promotedFile => promotedFile);
  }

  getPromotedFiles() {
    this.headers = new HttpHeaders();
    const token = sessionStorage.getItem('access-token');
    this.headers = this.headers.set('x-access-token', token);
    this.headers = this.headers .set('content-type', 'application/json')
    this.headers = this.headers .set('Access-Control-Allow-Origin', '*')
    console.log(this.headers);
    const url = window.location.origin + '/getPromoted';
    return this.http.get(url,{headers: this.headers}).map(data => data);
  }

  deletePromotedFile(file) {
    const url = window.location.origin + '/deleteTalk/'+file.name;
    return this.http.delete(url).map(deleted => deleted);
  }
}
