import { LoginService } from './../home/login.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class CanActivateRouterGuard implements CanActivate {
    constructor(private login: LoginService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {

        if (sessionStorage.getItem('isAuth') === 'true') {
            this.login.isLoggedIn = true;
        } else {
            this.login.isLoggedIn = false;
        }
        return this.login.isLoggedIn;
    }

}
