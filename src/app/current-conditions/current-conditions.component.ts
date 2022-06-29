import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly locationService: LocationService,
    private readonly router: Router
  ) {}

  getCurrentConditions() {
    return this.weatherService.getCurrentConditions();
  }

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }
}
