import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isSaved;
  savedUser;

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

    const url = window.location.origin + '/processList/'+email;

    return this.http.get(url).map(res => res);
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
    const url = window.location.origin + '/getUserProfile/'+email;

    return this.http.get(url).map(res => res);
  }

  updateProfile(user){
    const url = window.location.origin + '/updateProfile';

    return this.http.post(url, user).map(res => res);
  }

}
