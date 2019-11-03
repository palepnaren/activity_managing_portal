import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  profileGroup: FormGroup;
  user:any;
  isSubmitButtonValid: boolean = false;
  fileName: string = "Choose file";
  file: any;
  fileType: any;
  imageSrc: any = "../../assets/images/profile-image-default.jpeg"
  isProfileSaved = false;
  constructor(private fbuilder: FormBuilder, private userService: UserService) { 

    

  }

  ngOnInit() {

    this.userService.getProfile(sessionStorage.getItem('email')).subscribe(user => {
      if(user != null){
        // console.log(user);
        this.user = user;
        this.profileGroup.get('first_name').setValue(this.user.fname);
        this.profileGroup.get('last_name').setValue(this.user.lname);
        this.profileGroup.get('email').setValue(this.user.email);
        if(this.user.address != undefined || this.user.address != null){
          this.profileGroup.get('address').setValue(this.user.address);
        }
        if(this.user.city != undefined || this.user.city != null){
          this.profileGroup.get('city').setValue(this.user.city);
        }
        if(this.user.state != undefined || this.user.state != null){
          this.profileGroup.get('state').setValue(this.user.state);
        }
        if(this.user.role != undefined || this.user.role != null){
          this.profileGroup.get('role').setValue(this.user.role);
        }
        if(this.user.profileImage != undefined || this.user.profileImage != null){
          this.imageSrc = this.user.profileImage;
        }
        
      } else{
      }
    });

    this.profileGroup = this.fbuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email : ['', [Validators.email, Validators.required]],
      // username: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(4)]],
      address: ['',[Validators.maxLength(100)]],
      city: ['',[Validators.maxLength(30)]],
      state: ['', [Validators.maxLength(20)]],
      password : ['', [Validators.minLength(6)]],
      cmp_password : ['', [Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });


  }

  updateUserProfile(fname, lname, email, address, city, state, role, pwd){

    const userProfile = {
      email: email,
      fname: fname,
      lname: lname,
      pwd: pwd,
      address: address,
      city: city,
      state: state,
      role: role,
      profileImage: this.imageSrc
    }

    this.userService.updateProfile(userProfile).subscribe(saved => {
      console.log("User profile saved is: "+saved);
      if(saved){
        this.isProfileSaved = true;
      } else{
        this.isProfileSaved = false;
      }
    });

  }

  image(e){
    e.preventDefault();

    this.file = e.target.files[0];
    this.fileName = this.file.name;
    const index = this.fileName.lastIndexOf('.');
    this.fileType = this.fileName.substr(index);
    console.log(this.file.size);
    console.log(e);

    if (this.fileType === '.jpeg' || this.fileType === '.png' || this.fileType === '.jpg') {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.imageSrc = reader.result;
        // console.log(this.imageSrc);
      });

      reader.readAsDataURL(this.file);
    } else {
      alert("We only support JPEG and PNG");
    }

  }

  comparePassword(pwd, cnf_pwd){

  }

}
