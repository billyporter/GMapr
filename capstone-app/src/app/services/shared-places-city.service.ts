import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedPlacesCityService {
  private cityName = new BehaviorSubject<string>(null);
  private placesSource = new BehaviorSubject<Map<string, string[]>>(null);

  setPlaces(newPlaces: Map<string, string[]>) {
    this.placesSource.next(newPlaces);
  }

  setCityName(newCity: string) {
    this.cityName.next(newCity);
  }

  getCityName() {
    return this.cityName.asObservable();
  }

  getPlacesSource() {
    return this.placesSource.asObservable();
  }
}
