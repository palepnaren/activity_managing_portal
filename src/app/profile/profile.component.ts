import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  profileGroup: FormGroup;
  constructor(private fbuilder: FormBuilder) { }

  ngOnInit() {

    this.profileGroup = this.fbuilder.group({
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

}
