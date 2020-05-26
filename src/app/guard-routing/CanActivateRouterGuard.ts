import { LoginService } from './../home/login.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class CanActivateRouterGuard implements CanActivate {
    constructor(private login: LoginService,private router:Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {

        if (sessionStorage.getItem('isAuth') === 'true' && sessionStorage.getItem('access-token') != "") {
            this.login.isLoggedIn = true;
        } else {
            this.login.isLoggedIn = false;
            this.router.navigateByUrl("/login");
        }
        return this.login.isLoggedIn;
    }

}
