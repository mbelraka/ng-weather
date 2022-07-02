import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { countries } from 'country-list-json';

import { LocationService } from '../location.service';
import { LoadingStatus } from '../enums/loading-status.enum';
import { Country } from '../models/country.model';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  styleUrls: ['./zipcode-entry.component.css'],
})
export class ZipcodeEntryComponent implements OnInit, OnDestroy {
  public readonly REFERENCE_COUNTRIES: Country[] = countries;

  public filteredCountries = this.REFERENCE_COUNTRIES;
  public loading = LoadingStatus.READY;

  public showCountriesList = false;
  public countryModel = '';
  public activeCountry: Country = {
    code: '',
    dial_code: '',
    flag: '',
    name: '',
  };

  private readonly _destroy$ = new Subject<void>();

  public constructor(
    public readonly locationService: LocationService,
    private readonly_changeDetector: ChangeDetectorRef
  ) {}

  public addLocation(zipcode: string): void {
    if (zipcode?.length > 0 && this.activeCountry?.code?.length > 0) {
      this.locationService.addLocation({
        zipcode,
        countryCode: this.activeCountry?.code,
      });
    }
  }

  public get appLoading(): boolean {
    return this.loading === LoadingStatus.LOADING;
  }

  public get appDone(): boolean {
    return this.loading === LoadingStatus.DONE;
  }

  public filterCountries(input): void {
    this._filterCountriesList(input?.target?.value?.toLowerCase());
  }

  public pickCountry(country): void {
    this.activeCountry = country;
    this.countryModel = this.activeCountry?.name;
    this._filterCountriesList(country);
  }

  public showList(value: boolean): void {
    this.showCountriesList = value;
    this.readonly_changeDetector.detectChanges();
  }

  public ngOnInit(): void {
    this.locationService.loading$
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (loading: LoadingStatus): LoadingStatus => (this.loading = loading)
      );
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _filterCountriesList(prefix): void {
    this.filteredCountries = this.REFERENCE_COUNTRIES.filter(
      (country: Country) => country.name?.toLowerCase().startsWith(prefix)
    );
  }
}
