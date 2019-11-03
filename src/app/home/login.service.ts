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
    user: null
  };

  isAuth(email, pwd) {

    this.isLoading = true;

    const url = window.location.origin + '/auth';
    this.userLogin.email = email;
    this.userLogin.pwd = pwd;

    this.http.post(url, this.userLogin, { responseType: 'json'}).subscribe(user => {
      this.authUser.loggedIn = Object.values(user)[0];
      this.authUser.user = Object.values(user)[1];
    });

    setTimeout( () => {
      if (this.authUser.loggedIn === true) {
        this.isLoading = false;
        this.isLoggedIn = true;
        sessionStorage.setItem('name', this.authUser.user.fullName);
        sessionStorage.setItem('role', this.authUser.user.role);
        sessionStorage.setItem('email', this.userLogin.email);
        sessionStorage.setItem('isAuth', '' + this.isLoggedIn);
        sessionStorage.setItem('profileImage', this.authUser.user.profileImage);
        $('#loop > li#dashboard >a').addClass('active');
        this.router.navigateByUrl('/dashboard');
      } else {
        this.isLoading = false;
        this.isLoggedIn = false;
        this.isfailed = false;
        sessionStorage.setItem('isAuth', '' + this.isLoggedIn);
        this.router.navigateByUrl('');
      }
    }, 3500);

  }

  userLogout() {
    const url = window.location.origin + '/destroy';

    return this.http.get(url);
  }

}
