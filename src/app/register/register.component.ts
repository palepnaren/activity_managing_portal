import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  registerGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

   this.registerGroup = this.formBuilder.group({

      email : ['', [Validators.email, Validators.required]],
      password : ['', [Validators.required, Validators.minLength(6)]],
      cmp_password : ['', [Validators.required, Validators.minLength(6)]]

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

  register(email, pwd, cmpPwd) {

    localStorage.setItem('email', email);
    localStorage.setItem('pwd', pwd);
    localStorage.setItem('cmpPwd', cmpPwd);

    this.registerGroup.reset();
    alert('User registered successfully');


  }

  get fr() {
    return this.registerGroup.controls;
  }

}
