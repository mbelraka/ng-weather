import { Injectable } from '@angular/core';

import { WeatherService } from './weather.service';
import { Zipcode } from './models/zipcode.model';

export const LOCATIONS = 'locations';

@Injectable({ providedIn: 'root' })
export class LocationService {
  public locations: Zipcode[] = [];

  public readonly loading$ = this._weatherService.loading$;

  public constructor(private readonly _weatherService: WeatherService) {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }

    for (const loc of this.locations) {
      this._weatherService.addCurrentConditions(loc);
    }
  }

  public addLocation(location: Zipcode): void {
    this.locations.push(location);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this._weatherService.addCurrentConditions(location);
  }

  public removeLocation(location: Zipcode): void {
    const index = this.locations.indexOf(location);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this._weatherService.removeCurrentConditions(location);
    }
  }
}
