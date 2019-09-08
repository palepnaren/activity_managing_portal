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

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent,
    SharedTalksComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
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
        // canActivate: [CanActivateRouterGuard]
      },
      {
        path: 'sharedTalks',
        component: SharedTalksComponent,
        // canActivate: [CanActivateRouterGuard]

      },
      {
        path: 'logout',
        component: HomeComponent
      }
  ])
  ],
  providers: [
    WeatherService,
    LoginService,
    CanActivateRouterGuard,
    AudioService,
    UserService,
    CookieService,
    EncdecryptService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
