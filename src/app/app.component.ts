import { LoginService } from './home/login.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { UserService } from './service/user.service';
import * as copy from 'copy-to-clipboard';
import { PushNotificationsService } from 'ng-push';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'team-project';
  test: any;
  isLoggedIn: boolean;
  isAdmin: string = "false";
  name;
  events = ['load', 'resize'];
  obj= {
      todayDate: '2019-10-10',
      conversations: '1',
      dtm: '1',
      mg1: '1',
      mg2: '1',
      mg3: '1',
      bp1: '1',
      bp2: '1',
      ft1: '1',
      ft2: '1',
      preLaunch: '1',
      launch: '1',
      others: '1'
  };
  tempArray;
  messaging;
  src = "../assets/images/profile-image-default.jpeg";

  constructor(private http: HttpClient, private router: Router, private login: LoginService, 
    private userService: UserService, private notification: PushNotificationsService) {

      this.notification.requestPermission();
    
  }

  ngOnInit() {

      setInterval(() => {
        this.isLoggedIn = this.login.isLoggedIn;
        
        if (this.isLoggedIn) {
          this.name = sessionStorage.getItem('name');
          if(sessionStorage.getItem('role').toLowerCase() === 'ibo' || sessionStorage.getItem('role').toLowerCase() === 'silver' || sessionStorage.getItem('role').toLowerCase() === 'eagle'){
            this.isAdmin = "false";
          } else{
            this.isAdmin = "true";
          }
          if(sessionStorage.getItem("profileImage") != "undefined"){
            this.src = sessionStorage.getItem("profileImage");
          } else {
            this.src = "../assets/images/profile-image-default.jpeg";
          }
          // console.log(this.name);
          this.isLoggedIn = this.login.isLoggedIn;
        }
        if(localStorage.getItem('todayEntry') === '' || localStorage.getItem('todayEntry') === null || localStorage.getItem('todayEntry') === undefined){
          
        } else {
          this.obj.todayDate = localStorage.getItem('todayEntry').split('~')[0];
          this.obj.conversations = localStorage.getItem('todayEntry').split('~')[1];
          this.obj.dtm = localStorage.getItem('todayEntry').split('~')[2];
          this.obj.mg1 = localStorage.getItem('todayEntry').split('~')[3];
          this.obj.mg2 = localStorage.getItem('todayEntry').split('~')[4];
          this.obj.mg3 = localStorage.getItem('todayEntry').split('~')[5];
          this.obj.bp1 = localStorage.getItem('todayEntry').split('~')[6];
          this.obj.bp2 = localStorage.getItem('todayEntry').split('~')[7];
          this.obj.ft1 = localStorage.getItem('todayEntry').split('~')[8];
          this.obj.ft2 = localStorage.getItem('todayEntry').split('~')[9];
          this.obj.preLaunch = localStorage.getItem('todayEntry').split('~')[10];
          this.obj.launch = localStorage.getItem('todayEntry').split('~')[11];
          this.obj.others = localStorage.getItem('todayEntry').split('~')[12];

          localStorage.removeItem('todayEntry');
        }
        
      }, 200);
  
}

ngAfterViewInit(): void {
  this.j_Query();
  
}



j_Query() {
  $(document).ready(() => {

    $('#toggle').click((e) => {
        e.preventDefault();
        $('#collapsibleNavbar').toggleClass('active');
        if ($('#collapsibleNavbar').hasClass('active')) {
          $('#collapsibleNavbar').addClass('left bg-dark navbar-dark');
          $('#collapsibleNavbar').show();
        } else {
          $('#collapsibleNavbar').removeClass('active');
          $('#collapsibleNavbar').removeClass('left bg-dark navbar-dark');
          $('#collapsibleNavbar').hide();
        }
    });

    const current = $('#loop > li').not('#exclude').children();

    current.each(function(i, elm) {
      $(elm).click(function() {
        current.removeClass('active');
        $(this).addClass('active');
      });
      $(this).parent().next().click(function() {
        current.removeClass('active');
        $(this).children().addClass('active');
      });
    });

    $('#modal').click((e) => {
      e.preventDefault();
    });

    
    // this.toggleMainMenu();

  });
}


//  toggleMainMenu(){

//   let counter = 0;
//     $('#main-menu').click(()=>{
//       counter = 1;
//       // $('#nav-menu').slideToggle(200);
      
//       if(counter === 1){
//         if($('#menu-icon').hasClass('fa-bars')){
//           $('#menu-icon').removeClass('fa-bars');
//           $('#menu-icon').addClass('fa-times');
//         } else{
//           $('#menu-icon').removeClass('fa-times');
//           $('#menu-icon').addClass('fa-bars');
//         }
//       }
      
//     });

//  }


copy(){
  
  let copyString = "";
  if(this.name != null || this.name != undefined){
    copyString = "Name: "+this.name+"\n";
  }
  if(this.obj.todayDate != '2019-10-10'){
    copyString += "Date: "+this.obj.todayDate+"\n";
  } if(this.obj.conversations != ''){
    copyString += "conversations: "+this.obj.conversations+"\n";
  }  if(this.obj.dtm !=''){
    copyString += "Dtm: "+this.obj.dtm+"\n"
  }  if(this.obj.mg1 != ''){
    copyString += "MG1: "+this.obj.mg1+"\n";
  }  if(this.obj.mg2 != ''){
    copyString += "MG2: "+this.obj.mg2+"\n";
  }  if(this.obj.mg3 != ''){
    copyString += "MG3: "+this.obj.mg3+"\n";
  }  if(this.obj.bp1 != ''){
    copyString += "BP1: "+this.obj.bp1+"\n";
  }  if(this.obj.bp2 != ''){
    copyString += "BP2: "+this.obj.bp2+"\n";
  }  if(this.obj.ft1 != ''){
    copyString += "FT1: "+this.obj.ft1+"\n";
  }  if(this.obj.ft2 != ''){
    copyString += "FT2: "+this.obj.ft2+"\n";
  }  if(this.obj.preLaunch != ''){
    copyString += "PreLaunch: "+this.obj.preLaunch+"\n";
  }  if(this.obj.launch != ''){
    copyString += "Launch: "+this.obj.launch+"\n";
  }  if(this.obj.others != ''){
    copyString += "Others: "+this.obj.others;
  }
  copy(copyString, {message:"Copied!"});

}

logout() {
  $('#loop > li#dashboard >a').removeClass('active');
  $('#loop > li#training >a').removeClass('active');
  $('#loop > li#profile >a').removeClass('active');
  this.login.isLoggedIn = false;
  sessionStorage.setItem('isAuth', '' + this.login.isLoggedIn);
  sessionStorage.removeItem('name');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('isAuth');
  this.login.userLogout().subscribe(() => {
    console.log('User Logged out');
    // window.location.reload();
  });


}

}

