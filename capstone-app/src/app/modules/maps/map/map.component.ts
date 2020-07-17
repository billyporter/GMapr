/// <reference types="googlemaps" />
import { Component,  ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit{
  @ViewChild('searchBar', {static: true}) searchBar: ElementRef;
  @ViewChild('customWindow', {read: MapInfoWindow}) customWindow: MapInfoWindow;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  @Output() activeMarkerOutput = new EventEmitter<string>();
  @Output() markerDataOutput = new EventEmitter<Map<string, string[]>>();
  @Output() cityOutput = new EventEmitter<string>();

  nearSearch?: google.maps.places.PlacesService;
  location?: google.maps.LatLng;
  city: String = "Enter a city";
  zoom = 13;
  markerData = new Map<string, string[]>();
  searchMarkers: google.maps.MarkerOptions[] = [];
  autoMark: google.maps.Marker;
  position?: google.maps.LatLngLiteral;
  markers: google.maps.MarkerOptions[] = [];
  cityLocation: string;
  geocoder = new google.maps.Geocoder();
  activeMark: string;
  testlocation: google.maps.LatLng = new google.maps.LatLng(26.011760, -80.139050);
  placesRequest = {
    location: this.testlocation,
    radius: 5000,
    type: 'tourist_attraction'
  }
  myControl = new FormControl();
  optionsTypes: string[] = ['amusement_park', 'aquarium', 'campground', 'casino', 'church',
    'embassy', 'hindu_temple', 'library', 'lodging', 'mosque', 'movie_theater', 'museum',
    'night_club', 'park', 'police', 'restaurant', 'shopping_mall', 'stadium', 'synagogue', 
    'tourist_attraction', 'train_station', 'university', 'zoo'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.nearSearch = new google.maps.places.PlacesService(document.createElement('div'));
    this.getCurrentLocation();
    this.getCurrentOrSetLocation();
    this.locationSearch();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  changeType(newType: string) {
    this.placesRequest.type = newType;
    this.placesRequestFunc(this.location);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsTypes.filter(option => option.toLowerCase().includes(filterValue));
  }

  locationSearch() {
    const input = this.searchBar.nativeElement;
    this.cityLocation = this.searchBar.nativeElement.value;
    const autoComplete = new google.maps.places.Autocomplete(input,
      {fields: ['geometry', 'name', 'formatted_address'], types: ['(cities)']});
    autoComplete.addListener('place_changed', () => {
      this.location = autoComplete.getPlace().geometry.location;
      this.cityLocation = autoComplete.getPlace().formatted_address;
      this.placesRequest.type = 'tourist_attraction';
      this.placesRequestFunc(this.location);
      this.cityOutput.emit(this.cityLocation);
    });
  }

  placesRequestFunc(location: google.maps.LatLng) {
    this.placesRequest.location = this.location;
    this.nearSearch.nearbySearch(this.placesRequest, results => {
      // resetting data
      this.searchMarkers = [];
      this.markerData.clear();
      for (const result of results) {
        this.searchMarkers.push(this.createMarker(result));
        this.markerData.set(result.name, result.types);
      }
      this.markerDataOutput.emit(this.markerData);
    });
  }

  createMarker(result: google.maps.places.PlaceResult) {
   return {
    position: result.geometry.location,
    title: result.name,
    icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png"
    }
   };
  }

  openInfoWindow(marker: MapMarker) {
    this.activeMark = marker._marker.getTitle();
    this.infoWindow.open(marker);
    this.activeMarkerOutput.emit(this.activeMark);
  }

  getCurrentLocation () {
    navigator.geolocation.getCurrentPosition(position => {
      this.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.location = new google.maps.LatLng(this.position);
      this.geocoder.geocode({'location': this.position}, (results, status) => {
        if (status === 'OK') {
          results.filter(result => {
            result.types.forEach(type => {
              if (type == "locality") {
                this.cityLocation = result.formatted_address;
              }
            });
          });
        }
        this.cityOutput.emit(this.cityLocation);
      });
      this.placesRequestFunc(this.location);
    }, () => {
      this.cityLocation = "Los Angeles, CA, USA"
        this.location = new google.maps.LatLng(34.0522, -118.2437);
        this.placesRequestFunc(this.location);
        this.cityOutput.emit(this.cityLocation);
    });
    
    return this.position;
  }

  // gets our default location
  getCurrentOrSetLocation() {
    if (!this.location) {
      if (this.position) {
        this.location = new google.maps.LatLng(this.position);
      } else {
        this.cityLocation = "Los Angeles, CA, USA"
        this.location = new google.maps.LatLng(34.0522, -118.2437);
        this.placesRequestFunc(this.location);
        this.cityOutput.emit(this.cityLocation);
      }
    }
  }

  addMarker(event: google.maps.MouseEvent) {
    this.markers.push({
         position: event.latLng,
         title: 'Custom Marker',
         icon: {
           url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
         }
    });
  }

  clickMarker(marker: MapMarker) {
    this.customWindow.open(marker);
  }

  deleteAllCustomMark() {
    this.markers = [];
  }

  removeMarker(marker: MapMarker) {
    // position is guaranteed
    const markerIndex = this.markers.map(currentMarker => currentMarker.position as google.maps.LatLng)
      .indexOf(marker.getPosition());
    if (markerIndex > -1) {
      this.markers.splice(markerIndex, 1);
    }
  }
}
