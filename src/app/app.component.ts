import { LoginService } from './home/login.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { UserService } from './service/user.service';
import * as copy from 'copy-to-clipboard'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'team-project';
  test: any;
  isLoggedIn;
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
      fp1: '1',
      fp2: '1',
      preLaunch: '1',
      launch: '1',
      others: '1'
  };
  tempArray;

  constructor(private http: HttpClient, private router: Router, private login: LoginService, private userService: UserService) {
    
  }

  ngOnInit() {
      setInterval(() => {
        this.isLoggedIn = this.login.isLoggedIn;
        if (this.isLoggedIn) {
          this.name = sessionStorage.getItem('name');
          // console.log(this.name);
          this.isLoggedIn = this.login.isLoggedIn;
        }
        if(localStorage.getItem('todayEntry') === '' || localStorage.getItem('todayEntry') === null || localStorage.getItem('todayEntry') === undefined){
          
        } else {
          console.log('_________');
          console.log(this.obj);
          this.obj.todayDate = localStorage.getItem('todayEntry').split('~')[0];
          this.obj.conversations = localStorage.getItem('todayEntry').split('~')[1];
          this.obj.dtm = localStorage.getItem('todayEntry').split('~')[2];
          this.obj.mg1 = localStorage.getItem('todayEntry').split('~')[3];
          this.obj.mg2 = localStorage.getItem('todayEntry').split('~')[4];
          this.obj.mg3 = localStorage.getItem('todayEntry').split('~')[5];
          this.obj.bp1 = localStorage.getItem('todayEntry').split('~')[6];
          this.obj.bp2 = localStorage.getItem('todayEntry').split('~')[7];
          this.obj.fp1 = localStorage.getItem('todayEntry').split('~')[8];
          this.obj.fp2 = localStorage.getItem('todayEntry').split('~')[9];
          this.obj.preLaunch = localStorage.getItem('todayEntry').split('~')[10];
          this.obj.launch = localStorage.getItem('todayEntry').split('~')[11];
          this.obj.others = localStorage.getItem('todayEntry').split('~')[12];
        }
        
      }, 200);

      // this.j_Query();
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

    this.events.forEach(event => {
      window.addEventListener(event, (e) => {
        if (window.outerWidth < 770) {
          $('#nav-menu').hide();
          $('#main-body').addClass('col-sm-12 col-md-12 col-12');
          $('#main-menu').show();
          $('#main-menu').click(() => {
            $('#nav-menu').animate({
              zIndex: 20,
              transition: 0.5
            }, 500, 'linear', () => {
              console.log('Inside window resize');
              $('#main-body').toggleClass('col-sm-12 col-md-12 col-12');
              $('#nav-menu').toggle();
            });
          });
        } else {
          $('#main-body').removeClass('col-sm-12 col-md-12 col-12');
          $('#nav-menu').show();
          $('#main-menu').hide();
        }
      });
    });



  });
}

copy(){
  
  copy(localStorage.getItem('todayEntry'));
}

logout() {

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

