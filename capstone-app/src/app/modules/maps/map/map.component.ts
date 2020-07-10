/// <reference types="googlemaps" />
import { Component,  ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit, OnInit{
  @ViewChild('searchBar') searchBar: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap) mapComponent: GoogleMap;

  nearSearch?: google.maps.places.PlacesService;
  location?: google.maps.LatLng;
  city: String = "Enter a city";
  zoom = 13;
  markerData = new Map<string, string[]>();
  searchMarkers: google.maps.MarkerOptions[] = [];
  autoMark: google.maps.Marker;
  position?: google.maps.LatLngLiteral;
  markers: google.maps.MarkerOptions[] = [];
  locationNameArray: String[] = [];
  cityLocation: string;
  geocoder = new google.maps.Geocoder();
  activeMark: string;
  testlocation: google.maps.LatLng = new google.maps.LatLng(26.011760, -80.139050);
  placesRequest = {
    location: this.testlocation,
    radius: 5000,
    type: 'tourist_attraction'
  }

  ngOnInit() {
    this.getCurrentLocation();
    this.getCurrentOrSetLocation();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.locationSearch();
    });
    this.nearSearch = new google.maps.places.PlacesService(this.mapComponent._googleMap);
  }

  locationSearch() {
    const input = this.searchBar.nativeElement;
    this.cityLocation = this.searchBar.nativeElement.value;
    const autoComplete = new google.maps.places.Autocomplete(input,
      {fields: ['geometry', 'name', 'formatted_address'], types: ['(cities)']});
    autoComplete.addListener('place_changed', () => {
      this.location = autoComplete.getPlace().geometry.location;
      this.cityLocation = autoComplete.getPlace().formatted_address;
      this.placesRequestFunc(this.location);
    });
  }

  deleteAllMarks() {
    this.searchMarkers = [];
  }

  placesRequestFunc(location: google.maps.LatLng) {
    this.placesRequest.location = this.location;
    this.nearSearch.nearbySearch(this.placesRequest, results => {
      // resetting data
      this.deleteAllMarks();
      this.markerData.clear();
      this.locationNameArray = [];
      for (const result of results) {
        this.searchMarkers.push(this.createMarker(result));
        this.locationNameArray.push(result.name);
        this.markerData.set(result.name, result.types);
      }
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
  }

  getCurrentOrSetLocation() {
    if (!this.location) {
      if (this.position) {
        this.location = new google.maps.LatLng(this.position);
      }
      else {
        // default location Bogota, Colombia
        this.location = new google.maps.LatLng(4.7110, -74.0721);
      }
    }
  }

  getCurrentLocation () {
    navigator.geolocation.getCurrentPosition(position => {
      this.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.location = new google.maps.LatLng(this.position);
      this.getCurrentOrSetLocation();
      this.geocoder.geocode({'location': this.position}, function(results, status) {
        if (status === 'OK') {
          this.cityLocation = results[5].formatted_address;
        }
      });
      this.placesRequestFunc(this.location);
    }, () => {
      // default position
      this.position = {lat: 4.7110, lng: -74.0721};
      this.getCurrentOrSetLocation();

      this.geocoder.geocode({'location': this.position}, function(results, status) {
        if (status === 'OK') {
          this.cityLocation = results[5].formatted_address;
        }
      });
      this.cityLocation = 'Bogota, Colombia';
      this.placesRequestFunc(this.location);
    });
    
    return this.position;
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
    this.infoWindow.open(marker);
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