import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject, timer } from 'rxjs';
import { mergeMap, retry, share, takeUntil } from 'rxjs/operators';

import { WeatherService } from '../weather.service';
import { LocationService } from '../location.service';
import { LocationData } from '../models/location-data.model';
import { Zipcode } from '../models/zipcode.model';

@Component({
  selector: 'app-location-card',
  templateUrl: './location-card.component.html',
  styleUrls: ['./location-card.component.css'],
})
export class LocationCardComponent implements OnDestroy {
  private _location: Zipcode;
  private readonly _refreshInterval = 30000;
  private readonly _destroy$ = new Subject<void>();

  public locationData: LocationData;

  public get location(): Zipcode {
    return this._location;
  }

  public get locationString(): string {
    return `${this.location?.countryCode}, ${this.location?.zipcode}`;
  }

  @Input() public set location(value: Zipcode) {
    this._location = value;

    if (value) {
      this._getData();
    }
  }

  public constructor(
    public readonly weatherService: WeatherService,
    public readonly locationService: LocationService,
    private readonly _router: Router
  ) {}

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public showForecast(): void {
    if (this.location) {
      this._router.navigate([
        '/forecast',
        this.location?.countryCode,
        this.location?.zipcode,
      ]);
    }
  }

  public deleteCard(): void {
    this.locationService.removeLocation(this.location);
  }

  private _getData(): void {
    timer(0, this._refreshInterval)
      .pipe(
        share(),
        takeUntil(this._destroy$),
        mergeMap(() => this._dataObservable()),
        retry(5)
      )
      .subscribe((data) => (this.locationData = data));
  }

  private _dataObservable(): Observable<LocationData> {
    return this.weatherService
      .getZipCodeData(this._location)
      .pipe(takeUntil(this._destroy$));
  }
}
