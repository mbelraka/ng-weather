import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, interval, Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

import { LocationData } from './models/location-data.model';
import { LoadingStatus } from './enums/loading-status.enum';
import { Zipcode } from './models/zipcode.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  public static URL = 'http://api.openweathermap.org/data/2.5';
  public static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  public static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private _locations: Zipcode[] = [];
  private _observedLocations: Zipcode[] = [];
  private readonly BUTTON_ENABLE_INTERVAL = 500;

  public loading$ = new BehaviorSubject<LoadingStatus>(LoadingStatus.READY);

  public constructor(private http: HttpClient) {}

  public addCurrentConditions(location: Zipcode): void {
    // Here we make a request to get the current condition data from the API.
    // Note the use of backticks and an expression to insert the zipcode
    this.loading$.next(LoadingStatus.LOADING);
    this._locations.push(location);
    this._observedLocations.push(location);
  }

  public removeCurrentConditions(location: Zipcode): void {
    const index = this._locationIndexInList(this._locations, location);

    if (index >= 0) {
      this._locations.splice(+index, 1);
    }
  }

  public getZipCodeData(location: Zipcode): Observable<LocationData> {
    return this.http
      .get<LocationData>(
        `${WeatherService.URL}/weather?zip=${
          location?.zipcode
        },${location?.countryCode?.toLowerCase()}&units=imperial&APPID=${
          WeatherService.APPID
        }`
      )
      .pipe(
        finalize(() => {
          if (
            this._locationIndexInList(this._observedLocations, location) >= 0
          ) {
            this._stopObservingZipCode(location);
          }
        })
      );
  }

  public get locations(): Zipcode[] {
    return this._locations;
  }

  public getForecast(location: Zipcode): Observable<any> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get(
      `${WeatherService.URL}/forecast/daily?zip=${location?.zipcode},${location?.countryCode}&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  public getWeatherIcon(id): string {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return WeatherService.ICON_URL + 'art_fog.png';
    } else {
      return WeatherService.ICON_URL + 'art_clear.png';
    }
  }

  private _stopObservingZipCode(location: Zipcode): void {
    const elementIndex = this._locationIndexInList(
      this._observedLocations,
      location
    );

    if (elementIndex >= 0) {
      this._observedLocations.splice(elementIndex, 1);
      this.loading$.next(LoadingStatus.DONE);
      interval(this.BUTTON_ENABLE_INTERVAL)
        .pipe(take(1))
        .subscribe(() => this.loading$.next(LoadingStatus.READY));
    }
  }

  private _locationIndexInList(
    locations: Zipcode[],
    location: Zipcode
  ): number {
    return locations.findIndex(
      (loc: Zipcode) =>
        loc.zipcode === location.zipcode &&
        loc.countryCode === location.countryCode
    );
  }
}
