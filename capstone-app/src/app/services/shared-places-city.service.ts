import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedPlacesCityService {
  private cityName = new BehaviorSubject<string>(null);
  private placesSource = new BehaviorSubject<Map<string, string[]>>(null);
  private markerType = new BehaviorSubject<string>('Tourist Attraction');

  setPlaces(newPlaces: Map<string, string[]>, newMarkerType: string) {
    newPlaces.set(newMarkerType, []);
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

  setMarkerType(newMarkerType: string) {
    this.markerType.next(newMarkerType);
  }

  getMarkerType() {
    return this.markerType.asObservable;
  }
}
