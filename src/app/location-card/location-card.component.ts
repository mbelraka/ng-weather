import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { WeatherService } from '../weather.service';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-location-card',
  templateUrl: './location-card.component.html',
  styleUrls: ['./location-card.component.css'],
})
export class LocationCardComponent implements OnDestroy {
  private _location;
  private readonly _refreshInterval = 30000;
  private readonly _destroy$ = new Subject<void>();

  public get location() {
    return this._location;
  }

  @Input() public set location(value: any) {
    this._location = value;

    if (value) {
      this._refresh();
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

  private _refresh(): void {
    interval(this._refreshInterval)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {

      });
  }
}
