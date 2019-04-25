import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router: Router) { }
  isLoggedIn = false;

  isAuth(email, pwd): boolean {

    if (email === localStorage.getItem('email') && pwd === localStorage.getItem('pwd')) {
      console.log('Login success');
      this.router.navigateByUrl('/dashboard');
      this.isLoggedIn = true;
      return true;
    } else {
      alert('Username or password is incorrect');
      this.router.navigateByUrl('/');
      this.isLoggedIn = false;
      return false;
    }

  }
}
