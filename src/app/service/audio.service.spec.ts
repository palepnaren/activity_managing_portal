import { TestBed, async, inject } from '@angular/core/testing';

import { AudioService } from './audio.service';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {ResponseOptions, Response, XHRBackend, HttpModule, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import { HttpBackend } from '@angular/common/http';
import { HttpClientTestingBackend } from '@angular/common/http/testing/src/backend.d.js';
import { registerContentQuery } from '@angular/core/src/render3';

describe('AudioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[
        {provide:'http://localhost:9876/getPromoted', useValue: 'http://example.com'},
        AudioService
        // {provide: HttpBackend, useExisting: HttpClientTestingBackend},
        // { provide: HttpTestingController, useExisting: HttpClientTestingBackend }
      ]
    });
  });

  it('should be created', () => {
    const service: AudioService = TestBed.get(AudioService);
    expect(service).toBeTruthy();
  });

  describe('getpromoted()', () => {
    it('service should return value', inject([HttpTestingController, AudioService], (http: HttpTestingController, service: AudioService) => {
  
      const mockResponse = 
    [
      [
        {
          "data": {
            "name": "Good Music",
            "url": "http://example1.com"
          },
          "role": "platinum",
          "user": "test@gmail.com"
        }
      ],
      [
        [
          {
            "data": {
              "name": "Hello",
              "url": "http://example1.com"
            },
            "role": "platinum",
            "user": "test@gmail.com"
          }
        ]
      ],
      [
        [
          {
            "data": {
              "name": "Jumping Jack",
              "url": "http://example1.com"
            },
            "role": "platinum",
            "user": "test@gmail.com"
          }
        ]
      ]
    ];

    service.getPromotedFiles().subscribe((file) => {
      console.log(Object.values(file)[0][0].data);
      expect(Object.values(file).length).toBe(3);
      expect(Object.values(file)[0][0].data.name).toBe('Good Music');
    });

    const req = http.expectOne("http://localhost:9876/getPromoted");
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  
  
    // backend.connections.subscribe((connection) => {
    //   connection.mockRespond(new Response(new ResponseOptions({
    //     body: JSON.stringify(mockResponse)
    //   })));
    // });
  
    // audioservice.getPromotedFiles().subscribe((file) => {
    //   console.log("Hello");
    //   expect(file[0][0].data.name).toBe('Good Music');
    // });
  
    }));
  });
  
});



