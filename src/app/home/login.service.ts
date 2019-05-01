import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router: Router) { }
  isLoggedIn = false;
  user;

  isAuth(email, pwd): boolean {
    this.user = email;
    if (email === localStorage.getItem('email') && pwd === localStorage.getItem('pwd')) {
      console.log('Login success');
      this.router.navigateByUrl('/dashboard');
      this.isLoggedIn = true;
      localStorage.setItem('flag', '' + this.isLoggedIn);
      return true;
    } else {
      alert('Username or password is incorrect');
      this.router.navigateByUrl('/');
      this.isLoggedIn = false;
      return false;
    }

  }

  // loggedUser() {

  //   return {
  //     user: localStorage.getItem('user'),
  //     flag: localStorage.getItem('flag')
  //   };
  // }
}
