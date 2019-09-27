import { TestBed, async } from '@angular/core/testing';

import { EncdecryptService } from './encdecrypt.service';
import { HttpClientModule } from '@angular/common/http';

describe('EncdecryptService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule]
    });
  }));

  it('should be created', () => {
    const service: EncdecryptService = TestBed.get(EncdecryptService);
    expect(service).toBeTruthy();
  });
});
