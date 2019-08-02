import { TestBed } from '@angular/core/testing';

import { EncdecryptService } from './encdecrypt.service';

describe('EncdecryptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncdecryptService = TestBed.get(EncdecryptService);
    expect(service).toBeTruthy();
  });
});
