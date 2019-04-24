import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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


  constructor(private http: HttpClient, private router: Router) {

  }

  ngOnInit() {
 this.j_Query();
}

j_Query() {
  $(document).ready(() => {

    $('#toggle').click((e) => {
        e.preventDefault();
        $('#collapsibleNavbar').toggleClass('active');
        if ($('#collapsibleNavbar').hasClass('active')) {
          $('#collapsibleNavbar').show();
        } else {
          $('#collapsibleNavbar').removeClass('active');
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
localStorage.removeItem('email');
localStorage.removeItem('pwd');

this.router.navigateByUrl('/');
}

}

