import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isSaved;
  savedUser;
  data = [];
  private headers: HttpHeaders;

  constructor(private http: HttpClient) { }

  regUser(user) {

    const url = window.location.origin + '/save';
    return this.http.post(url, user).map(res => res);
  }

  updateProcess(processData, email) {

    const url = window.location.origin + '/process';

    return this.http.post(url, {data: processData, user: email}).map(res => res);

  }

  getProcess(email) {

    this.headers = new HttpHeaders();
    const token = sessionStorage.getItem('access-token');
    this.headers = this.headers.set('x-access-token', token);
    this.headers = this.headers .set('content-type', 'application/json')
    this.headers = this.headers .set('Access-Control-Allow-Origin', '*')
    console.log(this.headers);

    const url = window.location.origin + '/processList/'+email;

    return this.http.get(url,{headers: this.headers}).map(res => res);
  }


  updatePwd(email, new_pwd){

    const data = {
      email: email,
      pwd: new_pwd
    }

    const url = window.location.origin + '/updatePassword';

    return this.http.post(url, data).map(res => res);
  }


  getProfile(email){
    this.headers = new HttpHeaders();
    const token = sessionStorage.getItem('access-token');
    this.headers = this.headers.set('x-access-token', token);
    this.headers = this.headers .set('content-type', 'application/json')
    this.headers = this.headers .set('Access-Control-Allow-Origin', '*')
    console.log(this.headers);
    const url = window.location.origin + '/getUserProfile/'+email;

    return this.http.get(url,{headers: this.headers}).map(res => res);
  }

  updateProfile(user){
    const url = window.location.origin + '/updateProfile';

    return this.http.post(url, user).map(res => res);
  }

  showNotificationAlert(){
    this.headers = new HttpHeaders();
    const token = sessionStorage.getItem('access-token');
    this.headers = this.headers.set('x-access-token', token);
    this.headers = this.headers .set('content-type', 'application/json')
    this.headers = this.headers .set('Access-Control-Allow-Origin', '*')
    const url = window.location.origin + '/getAlerts';

    return this.http.get(url,{headers:this.headers}).map(alerts => alerts);
  }

  setNotifications(val){
    this.data = val;
  }

  getNotifications():any{

    return this.data;
  }

}
