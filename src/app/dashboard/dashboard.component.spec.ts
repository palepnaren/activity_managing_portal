import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { UserService } from '../service/user.service';
import { AudioService } from '../service/audio.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from 'src/environments/environment.prod';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent, PaginationComponent, LoaderComponent ],
      imports:[BrowserModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, AngularFireModule.initializeApp(firebaseConfig), AngularFireDatabaseModule, RouterModule],
      providers:[UserService, AudioService, AngularFireDatabase, PaginationComponent],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
