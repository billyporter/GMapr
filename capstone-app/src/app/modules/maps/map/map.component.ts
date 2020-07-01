/// <reference types="googlemaps" />
import { Component,  ViewChild, ElementRef } from '@angular/core';
import {MapInfoWindow, MapMarker} from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  @ViewChild('searchBar') searchBar: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  location!: google.maps.LatLng;
  zoom = 13;
  position!: google.maps.LatLngLiteral;
  clickLocation: google.maps.LatLng[] = [];
  markers: google.maps.LatLng[] = [];

  ngAfterViewInit() {
    setTimeout(() => {
     const input = this.searchBar.nativeElement;
    
     const autoComplete = new google.maps.places.Autocomplete(input,
       {fields: ['geometry', 'name'], types: ['(cities)']});
     autoComplete.addListener('place_changed', () => {
       this.location = autoComplete.getPlace().geometry.location;
     });
    });
  }

  // update location using search button instead of input bar 
  searchButton(barcation: String) {
    const input = this.searchBar.nativeElement;
    const autoComplete = new google.maps.places.Autocomplete(input,
      {fields: ['geometry', 'name'], types: ['(cities)']});
    autoComplete.addListener('place_changed', () => {
      this.location = autoComplete.getPlace().geometry.location;
    });
  }

  getCurrentOrSetLocation() {
    if (!this.location) {
      return new google.maps.LatLng(this.position);
    }

    return this.location;
  }

  ngOnInit() {
    this.getCurrentLocation();
    this.getCurrentOrSetLocation();
  }

  getCurrentLocation () {
    navigator.geolocation.getCurrentPosition(position => {
    this.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })

    return this.position;
  }

  addMarker(event: google.maps.MouseEvent) {
    this.markers.push(event.latLng);
  }

  clickMarker(markerp: MapMarker) {
    this.infoWindow.open(markerp);
  }

  removeMarker(marker: MapMarker) {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i].equals(marker.getPosition())) {
        marker.ngOnDestroy();
      }
    }
  }
}

