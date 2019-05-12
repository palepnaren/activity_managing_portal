import { LoginService } from './home/login.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

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
  });
}

logout() {
// localStorage.removeItem('email');
// localStorage.removeItem('pwd');
// localStorage.removeItem('flag');
this.login.isLoggedIn = false;
this.router.navigateByUrl('/');


}

}

