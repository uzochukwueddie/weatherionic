import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';


@Injectable()
export class WeatherProvider {

  apiKey = ''; //open weather map api key

  constructor(
    private http: HttpClient,
    private geolocation: Geolocation
  ) {
    
  }

  async getPosition() {
    return await this.geolocation.getCurrentPosition();
  }

  currentWeather(lon: number, lat: number): Observable<any> {
    const currentInfo = this.http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${this.apiKey}`);
    const forecastInfo = this.http.get(`http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&units=metric&cnt=10&APPID=${this.apiKey}`);

    return Observable.forkJoin([currentInfo, forecastInfo])
      .map(responses => {
        return [].concat(...responses);
      });
  }

  SearchCity(city: string): Observable<any> {
    const currentWeather = this.http.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${this.apiKey}`);
    const forecastWeather = this.http.get(`http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=metric&cnt=10&APPID=${this.apiKey}`);

    return Observable.forkJoin([currentWeather, forecastWeather])
      .map(responses => {
        return [].concat(...responses);
      });
  }

}
