import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { UserService } from './service/user.service';
import { AudioService } from './service/audio.service';
import { LoginService } from './home/login.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WeatherService } from './service/weather.service';
import { SharedTalksComponent } from './shared-talks/shared-talks.component';
import { CanActivateRouterGuard } from './guard-routing/CanActivateRouterGuard';
import { PaginationComponent } from './pagination/pagination.component';
import { firebaseConfig } from 'src/environments/environment.prod';
import { CookieService } from 'ngx-cookie-service';
import { EncdecryptService } from './service/encdecrypt.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { LoaderComponent } from './loader/loader.component';
import { PushNotificationsModule} from 'ng-push';
import { DateModifyPipe } from './custom-pipes/custom-pipes.pipe';
import {JwtModule} from '@auth0/angular-jwt';

export function tokenGetter() {
  return sessionStorage.getItem('access-token');
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent,
    SharedTalksComponent,
    PaginationComponent,
    PasswordResetComponent,
    LoaderComponent,
    DateModifyPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    PushNotificationsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [CanActivateRouterGuard]
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [CanActivateRouterGuard]
      },
      {
        path: 'sharedTalks',
        component: SharedTalksComponent,
        canActivate: [CanActivateRouterGuard]

      },
      {
        path: 'logout',
        component: HomeComponent
      },
      {
        path: 'passwordReset',
        component: PasswordResetComponent
      },
      {
        path: 'refresh',
        component: PaginationComponent
      },
      {
        path: 'login',
        component: HomeComponent
      }
  ]),
  JwtModule.forRoot({
    config:{
      tokenGetter: tokenGetter,
      whitelistedDomains: ['localhost:4200','localhost:9500']
    }
  })
  ],
  providers: [
    WeatherService,
    LoginService,
    CanActivateRouterGuard,
    AudioService,
    UserService,
    CookieService,
    EncdecryptService,
    PaginationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
