import { TestBed, async } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';

describe('LoginService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule, RouterTestingModule, RouterModule]
    })
    .compileComponents();
  }));

  it('should be created', () => {
    const service: LoginService = TestBed.get(LoginService);
    expect(service).toBeTruthy();
  });
});
