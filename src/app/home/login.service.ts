import { Observable } from 'rxjs-compat/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/operator/map';
import { AppComponent } from '../app.component';
import * as $ from 'jquery';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router: Router, private http: HttpClient) { }
  isLoggedIn = false;
  isLoading = false;
  isfailed = true;
  userLogin = {
    email: '',
    pwd: ''
  };

  authUser = {
    loggedIn: false,
    user: null,
    token: ""
  };

  isAuth(email, pwd) {

    this.isLoading = true;

    const url = window.location.origin + '/auth';
    this.userLogin.email = email;
    this.userLogin.pwd = pwd;

    return this.http.post(url, this.userLogin, { responseType: 'json'}).map(user => user);

  }

  setLoginStatus(status){
    this.isLoggedIn = status;
  }

  getLoginStatus(){
    return this.isLoggedIn;
  }

  userLogout() {
    const url = window.location.origin + '/destroy';

    return this.http.get(url);
  }

}
