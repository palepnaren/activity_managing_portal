import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EmailValidator } from '../validators/email.validator';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.less']
})
export class PasswordResetComponent implements OnInit {

  resetGroup: FormGroup;
  isChanged;
  isLoading = false;
  constructor(private builder: FormBuilder, private userService: UserService) { }

  ngOnInit() {

    this.resetGroup = this.builder.group({
      email:['',[Validators.required, Validators.email, EmailValidator.emailValidate]],
      password:['',[Validators.required, Validators.minLength(6)]],
      pwd_renter:['', [Validators.required, Validators.minLength(6)]]
    });
  }

  pwdMatch(pwd, renter_pwd){

    if (pwd === renter_pwd) {
      return false;
    } else {
      return true;
    }

  }

  resetPwd(email, pwd){
    this.isLoading = true;
    this.userService.updatePwd(email, pwd).subscribe(updated => {
      this.isLoading = false;
      this.isChanged = updated;
      console.log('Pwd successfully updated' + this.isChanged);
    });
  }


  get r() {
    return this.resetGroup.controls;
  }

}
