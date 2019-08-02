import { Observable } from 'rxjs-compat/Observable';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '../validators/email.validator';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  formGroup: FormGroup;
  isLoading = false;
  isLoggedIn = true;

  constructor(private formBuilder: FormBuilder, private service: LoginService) { }


  ngOnInit() {

    this.formGroup = this.formBuilder.group({
         email: ['', [Validators.required, Validators.email, EmailValidator.emailValidate]],
         password: ['', Validators.required],
         rememberMe: ['']
    });

  }

   auth(email, pwd) {
     this.service.isAuth(email, pwd);
     setInterval(() => {
      this.isLoading = this.service.isLoading;
      this.isLoggedIn = this.service.isfailed;
     }, 200);
  }

  get f() {
    return this.formGroup.controls;
  }

}
