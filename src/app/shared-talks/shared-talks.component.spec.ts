import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTalksComponent } from './shared-talks.component';

describe('SharedTalksComponent', () => {
  let component: SharedTalksComponent;
  let fixture: ComponentFixture<SharedTalksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTalksComponent ]
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
