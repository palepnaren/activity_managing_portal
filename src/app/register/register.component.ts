import { UserService } from './../service/user.service';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EmailValidator } from '../validators/email.validator';
import * as $ from 'jquery';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  registerGroup: FormGroup;

  user = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: '',
    upline: ''
  };
  saved;

  constructor(private formBuilder: FormBuilder, private service: UserService) { }

  ngOnInit() {

   this.registerGroup = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email : ['', [Validators.email, Validators.required, EmailValidator.emailValidate]],
      username: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(6), EmailValidator.userNameValidate]],
      password : ['', [Validators.required, Validators.minLength(6)]],
      cmp_password : ['', [Validators.required, Validators.minLength(6)]],
      role: ['default', [Validators.required]],
      upline: ['', [Validators.required]]

   });
  }

  ngAfterViewInit() {
    $('loader').css({'display':'none'});
  }

  comparePwd(pwd, cmpPwd) {

    if (pwd === cmpPwd) {
      return false;
    } else {
      return true;
    }

  }

  register(fname, lname, email, username, pwd, role, upline) {

    $('loader').css({'display':'block'});

    this.user.firstName = fname;
    this.user.lastName = lname;
    this.user.email = email;
    this.user.username = username;
    this.user.password = pwd;
    this.user.role = role;
    this.user.upline = upline;

    this.service.regUser(this.user).subscribe( savedUser => {
      this.saved = savedUser;
    });

    setTimeout(() => {
      console.log(this.saved);
      if (this.saved) {
        $('loader').css({'display':'none'});
        setTimeout(() => {
          alert('User registered successfully');
        }, 200);
      } else {
        $('loader').css({'display':'none'});
        setTimeout(() => {
          alert('Error saving user');
        }, 200);
      }
    }, 16000);
    this.registerGroup.reset({
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      cmp_password: '',
      role: '',
      upline: ''
    });
  }

  get reg() {
    return this.registerGroup.controls;
  }

}
