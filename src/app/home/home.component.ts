import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs-compat/Observable';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '../validators/email.validator';
import { EncdecryptService } from '../service/encdecrypt.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  formGroup: FormGroup;
  isLoading = false;
  isLoggedIn = true;

  constructor(private formBuilder: FormBuilder, private service: LoginService,
              private router: Router, private cookie: CookieService, private encrypt: EncdecryptService) { }


  ngOnInit() {

    this.formGroup = this.formBuilder.group({
         email: [this.encrypt.decrypt(this.cookie.get('email')), [Validators.required, Validators.email, EmailValidator.emailValidate]],
         password: [this.encrypt.decrypt(this.cookie.get('password')), Validators.required],
         rememberMe: [this.cookie.get('isChecked')]
    });


  }

   auth(email, pwd) {
     this.service.isAuth(email, pwd);
     setInterval(() => {
      this.isLoading = this.service.isLoading;
      this.isLoggedIn = this.service.isfailed;
     }, 200);
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
