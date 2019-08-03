import { LoginService } from './home/login.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router, private login: LoginService) {

  }

  ngOnInit() {
      setInterval(() => {
        this.isLoggedIn = this.login.isLoggedIn;
        if (this.isLoggedIn) {
          this.name = sessionStorage.getItem('name');
          // console.log(this.name);
          this.isLoggedIn = this.login.isLoggedIn;
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

    window.addEventListener('resize', (e) => {
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

