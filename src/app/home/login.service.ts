import { Observable } from 'rxjs-compat/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/operator/map';


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

    const url = 'http://localhost:9500/auth';
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
        sessionStorage.setItem('isAuth', '' + this.isLoggedIn);
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

  // loggedUser() {

  //   return {
  //     user: localStorage.getItem('user'),
  //     flag: localStorage.getItem('flag')
  //   };
  // }
}
