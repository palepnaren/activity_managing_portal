import { Router } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
         email: ['', Validators.required],
         password: ['', Validators.required]
    });

  }

  auth(email, pwd) {

    if (email === localStorage.getItem('email') && pwd === localStorage.getItem('pwd')) {
      console.log('Login success');
      this.router.navigateByUrl('/dashboard');
    } else {
      alert('Username or password is incorrect');
      this.router.navigateByUrl('/');
    }

  }

  get f() {
    return this.formGroup.controls;
  }

}
