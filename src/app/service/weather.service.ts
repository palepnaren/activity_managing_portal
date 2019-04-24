import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import {Observable} from 'rxjs-compat';
import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {

  }


  getWeather(lat, long) {

    const APIKey = '8875e1370c80b3d10acab684f4416af1';
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=' + APIKey;

    return this.http.get(url)
        .map(res => res);

  }


}
