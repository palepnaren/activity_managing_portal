import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EmailValidator } from '../validators/email.validator';
import { UserService } from '../service/user.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.less']
})
export class PasswordResetComponent implements OnInit, AfterViewInit {

  resetGroup: FormGroup;
  isChanged;
  constructor(private builder: FormBuilder, private userService: UserService) { }

  ngOnInit() {

    this.resetGroup = this.builder.group({
      email:['',[Validators.required, Validators.email, EmailValidator.emailValidate]],
      password:['',[Validators.required, Validators.minLength(6)]],
      pwd_renter:['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngAfterViewInit(){
    $('loader').css({'display':'none'});
  }

  pwdMatch(pwd, renter_pwd){

    if (pwd === renter_pwd) {
      return false;
    } else {
      return true;
    }

  }

  resetPwd(email, pwd){
    $('loader').css({'display':'block'});
    this.userService.updatePwd(email, pwd).subscribe(updated => {
      $('loader').css({'display':'none'});
      this.isChanged = updated;
      console.log('Pwd successfully updated' + this.isChanged);
    });
  }


  get r() {
    return this.resetGroup.controls;
  }

}
