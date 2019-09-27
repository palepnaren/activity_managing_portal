import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTalksComponent } from './shared-talks.component';
import { LoaderComponent } from '../loader/loader.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

describe('SharedTalksComponent', () => {
  let component: SharedTalksComponent;
  let fixture: ComponentFixture<SharedTalksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTalksComponent, LoaderComponent, PaginationComponent ],
      imports: [HttpClientModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTalksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
