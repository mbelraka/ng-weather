import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export class ForecastsListComponent {
  forecast: any;

  constructor(
    private readonly weatherService: WeatherService,
    route: ActivatedRoute
  ) {
    route.params.subscribe((params: Params) => {
      weatherService
        .getForecast({
          zipcode: params['zipcode'],
          countryCode: params['countryCode'],
        })
        .subscribe((data) => (this.forecast = data));
    });
  }
}
