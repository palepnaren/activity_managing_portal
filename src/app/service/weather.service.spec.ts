import { TestBed, async } from '@angular/core/testing';

import { WeatherService } from './weather.service';
import { HttpClientModule } from '@angular/common/http';

describe('WeatherService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule]
    });
  }));

  it('should be created', () => {
    const service: WeatherService = TestBed.get(WeatherService);
    expect(service).toBeTruthy();
  });
});
