import { LoginService } from './login.service';
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

  constructor(private formBuilder: FormBuilder, private service: LoginService) { }


  ngOnInit() {

    this.formGroup = this.formBuilder.group({
         email: ['', Validators.required],
         password: ['', Validators.required],
         rememberMe: ['']
    });

  }

   auth(email, pwd): boolean {
    return this.service.isAuth(email, pwd);
  }

  get f() {
    return this.formGroup.controls;
  }

}
