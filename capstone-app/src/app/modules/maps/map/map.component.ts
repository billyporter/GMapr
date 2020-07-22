/// <reference types="googlemaps" />
import { SharedPlacesCityService } from 'src/app/services/shared-places-city.service';
import { Component,  ViewChild, ElementRef, OnInit, Output, Input, 
  EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnChanges {
  @ViewChild('searchBar', {static: true}) searchBar: ElementRef;
  @ViewChild('customWindow', {read: MapInfoWindow}) customWindow: MapInfoWindow;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChildren(MapMarker) allMarkers !: MapMarker[];

  @Input() activeMark: string;
  @Output() activeMarkerOutput = new EventEmitter<string>();

  // allMarkers: MapMarker[] = [];
  infoWindowMarker: MapMarker;
  nearSearch?: google.maps.places.PlacesService;
  location?: google.maps.LatLng;
  city: string;
  zoom = 13;
  markerData = new Map<string, string[]>();
  searchMarkers: google.maps.MarkerOptions[] = [];
  autoMark: google.maps.Marker;
  position?: google.maps.LatLngLiteral;
  markers: google.maps.MarkerOptions[] = [];
  cityLocation: string;
  geocoder = new google.maps.Geocoder();
  testlocation: google.maps.LatLng = new google.maps.LatLng(26.011760, -80.139050);
  placesRequest = {
    location: this.testlocation,
    radius: 5000,
    type: 'tourist_attraction'
  }
  optionsTypes: string[] = ['Airport', 'Amusement Park', 'Aquarium', 'Art Gallery', 'Atm', 
    'Bar', 'Book Store', 'Bowling Alley', 'Bus Station', 'Cafe', 'Campground', 
    'Casino', 'Cemetery', 'Church', 'City Hall', 'Clothing Store', 'Convenience Store',
    'Courthouse', 'Department Store', 'Electronics Store', 'Embassy', 'Gym',
    'Hindu Temple', 'Jewelry Store', 'Library', 'Lodging', 'Meal Delivery',
    'Meal Takeaway', 'Mosque', 'Movie Theater', 'Museum','Night Club', 'Park', 'Police', 
    'Restaurant', 'Rv Park', 'Shopping Mall', 'Stadium', 'Store', 'Subway Station', 'Supermarket',
    'Synagogue', 'Taxi Stand', 'Tourist Attraction', 'Train Station', 'Transit Station', 'University', 'Zoo'];

  constructor(private readonly changeDetector: ChangeDetectorRef, private placeCitySharer: SharedPlacesCityService) {}

  ngOnInit() {
    this.nearSearch = new google.maps.places.PlacesService(document.createElement('div'));
    this.getCurrentLocation();
    this.getCurrentOrSetLocation();
    this.locationSearch();
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.activeMark) {
      if (change.activeMark.currentValue === '') {
        this.infoWindow.close();
      }
      else if (this.allMarkers) {
        this.infoWindowMarker = this.getMarkerFromTitle(this.activeMark);
        if (this.infoWindowMarker) {
          this.openInfoWindow(this.infoWindowMarker);
        }
        else {
          this.infoWindow.close();
        }
      }
    }
  }

  changeType(newType: string) {
    let title = newType.split(' ')
                .join('_')
                .toLowerCase();
    this.placesRequest.type = title;
    this.placesRequestFunc(this.location);
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
      this.placeCitySharer.setCityName(this.cityLocation);
      this.changeDetector.detectChanges();
    });
  }

  placesRequestFunc(location: google.maps.LatLng) {
    this.placesRequest.location = this.location;
    console.log('here');
    this.nearSearch.nearbySearch(this.placesRequest, results => {
      // resetting data
      this.searchMarkers = [];
      this.markerData.clear();
      for (const result of results) {
        this.searchMarkers.push(this.createMarker(result));
        this.markerData.set(result.name, result.types);
      }
      this.placeCitySharer.setPlaces(this.markerData);
      console.log('here');
      this.changeDetector.detectChanges();
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

  private locationCallbackFail() {
    this.cityLocation = "Los Angeles, CA, USA"
    this.location = new google.maps.LatLng(34.0522, -118.2437);
    this.placesRequestFunc(this.location);
    this.placeCitySharer.setCityName(this.cityLocation);
  }

  locationCallbackSuccess(position: Position) {
    this.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    this.location = new google.maps.LatLng(this.position);
    this.geocoder.geocode({'location': this.position}, (results, status) => {
      if (status === 'OK') {
        const resultArr = results.filter(result => result.types.includes('locality'));
        this.cityLocation = resultArr[0].formatted_address;
      }
      this.placeCitySharer.setCityName(this.cityLocation);
    });
    this.placesRequestFunc(this.location);
  }

  getCurrentLocation () {
    navigator.geolocation.getCurrentPosition(position =>  this.locationCallbackSuccess(position), this.locationCallbackFail);
    return this.position;
  }

  // gets our default location
  getCurrentOrSetLocation() {
    if (!this.location) {
      if (this.position) {
        this.location = new google.maps.LatLng(this.position);
      } else {
        this.cityLocation = "Los Angeles, CA, USA";
        this.location = new google.maps.LatLng(34.0522, -118.2437);
        this.placesRequestFunc(this.location);
        this.placeCitySharer.setCityName(this.cityLocation);
        this.placesRequestFunc(this.location);
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

  getMarkerFromTitle(markerTitle: string) {
    for (const marker of this.allMarkers) {
      if (marker && marker._marker.getTitle() === markerTitle) {
        return marker;
      }
    }
  }
}
