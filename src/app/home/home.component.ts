import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs-compat/Observable';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EmailValidator } from '../validators/email.validator';
import { EncdecryptService } from '../service/encdecrypt.service';
import * as $ from 'jquery';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, AfterViewInit {

  formGroup: FormGroup;
  isLoggedIn = true;
  isLoading = false;
  isfailed = true;
  authUser = {
    loggedIn: false,
    user: null,
    token: ""
  };

  constructor(private formBuilder: FormBuilder, private service: LoginService,
              private router: Router, private cookie: CookieService, private encrypt: EncdecryptService) { 

                console.log("Testing");
                if(this.router.url.indexOf('errorLogin') > -1){
                  this.isLoggedIn = false;
                }
              }


  ngOnInit() {
    this.formGroup = this.formBuilder.group({
         email: [this.encrypt.decrypt(this.cookie.get('email')), [Validators.required, Validators.email, EmailValidator.emailValidate]],
         password: [this.encrypt.decrypt(this.cookie.get('password')), Validators.required],
         rememberMe: [this.cookie.get('isChecked')]
    });


  }

  ngAfterViewInit() {
      $('loader').css({'display':'none'});
  }

   auth(email, pwd) {
    $('loader').css({'display':'block'});
     this.service.isAuth(email, pwd).subscribe(user => {
       if(user){
        $('loader').css({'display':'none'});
       }
      this.authUser.loggedIn = Object.values(user)[0];
      this.authUser.user = Object.values(user)[1];
      this.authUser.token = Object.values(user)[2];

      if (this.authUser.loggedIn === true) {
        this.isLoading = false;
        this.isLoggedIn = true;
        sessionStorage.setItem('name', this.authUser.user.fullName);
        sessionStorage.setItem('role', this.authUser.user.role);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('isAuth', '' + this.isLoggedIn);
        sessionStorage.setItem('profileImage', this.authUser.user.profileImage);
        sessionStorage.setItem('access-token',this.authUser.token);
        console.log("Token" +this.authUser.token);
        console.log("Session Token" +sessionStorage.getItem('access-token'));
        $('#loop > li#dashboard >a').addClass('active');
        this.router.navigateByUrl('/dashboard');
      } else {
        this.isLoading = false;
        this.isLoggedIn = false;
        this.isfailed = false;
        sessionStorage.setItem('isAuth', '' + this.isLoggedIn);
        this.router.navigateByUrl('/?errorLogin=true');
      }
    });
    
  }

  isChecked(value: any) {
    if (value.target.checked) {
      this.cookie.set('email', this.encrypt.encrypt(this.formGroup.controls.email.value));
      this.cookie.set('password', this.encrypt.encrypt(this.formGroup.controls.password.value));
      this.cookie.set('isChecked', value.target.checked);
     }
  }

  get f() {
    return this.formGroup.controls;
  }

}
