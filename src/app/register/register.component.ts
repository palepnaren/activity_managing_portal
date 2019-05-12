import { UserService } from './../service/user.service';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

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
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private service: UserService) { }

  ngOnInit() {

   this.registerGroup = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email : ['', [Validators.email, Validators.required]],
      username: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(4)]],
      password : ['', [Validators.required, Validators.minLength(6)]],
      cmp_password : ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
      upline: ['', [Validators.required]]

   });
  }

  comparePwd(pwd, cmpPwd) {

    if (pwd === cmpPwd) {
      console.log('Password matches');
      return false;
    } else {
      return true;
    }

  }

  register(fname, lname, email, username, pwd, role, upline) {

    this.isLoading = true;

    console.log(fname + '~' + '~' + lname + '~' + email + '~' + username + '~' + pwd + '~' + role + '~' + upline);

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
        this.isLoading = false;
        setTimeout(() => {
          alert('User registered successfully');
        }, 200);
      } else {
        this.isLoading = false;
        setTimeout(() => {
          alert('Error saving user');
        }, 200);
      }
    }, 16000);
    this.registerGroup.reset();
  }

  get reg() {
    return this.registerGroup.controls;
  }

}
