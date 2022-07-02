import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  constructor(
    public readonly weatherService: WeatherService,
    private readonly _router: Router
  ) {}

  public get locations(): any[] {
    return this.weatherService.locations;
  }

  public showForecast(zipcode: string): void {
    this._router.navigate(['/forecast', zipcode]);
  }
}
