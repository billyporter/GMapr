/// <reference types="googlemaps" />
import { SharedPlacesCityService } from 'src/app/services/shared-places-city.service';
import { Component,  ViewChild, ElementRef, OnInit, Output, Input, 
  EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { darkModeTheme } from 'src/app/modules/maps/assets/darkMode';
import { retroModeTheme } from './../assets/retroMode';
import { nightModeTheme } from './../assets/nightMode';
import { aubergineModeTheme } from './../assets/aubergineMode';
import { silverModeTheme } from './../assets/silverMode';
import { lightModeTheme } from './../assets/lightMode';

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
  zoom = window.innerWidth > 600 ? 13 : 12;
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
  };
  optionsTypes: string[][] = [
    ['Airport', 'local_airport'],
    ['Bar', 'local_bar'],
    ['Church', 'add'], ['City Hall', 'home_work'],
    ['Lodging', 'hotel'],
    ['Museum', 'museum'], ['Park', 'nature_people'], ['Police', 'local_police'],
    ['Restaurant', 'restaurant'], ['Store', 'store'],
    ['Tourist Attraction', 'public'], ['University', 'school']
  ];
  showOptions = false;

  // Todo smontana: exporting these from a separate style so as to not clutter the component file.
  darkMode: google.maps.MapTypeStyle[] = darkModeTheme;
  retroMode: google.maps.MapTypeStyle[] = retroModeTheme;
  silverMode: google.maps.MapTypeStyle[] = silverModeTheme;
  nightMode: google.maps.MapTypeStyle[] = nightModeTheme;
  aubergineMode: google.maps.MapTypeStyle[] = aubergineModeTheme;
  lightMode: google.maps.MapTypeStyle[] = lightModeTheme;
  mapTypes: string[][] = [
    ['Aubergine', 'brightness_4'],
    ['Dark', 'wb_cloudy'],
    ['Light', 'wb_sunny'],
    ['Night', 'bedtime'],
    ['Retro', 'sports_motorsports'],
    ['Silver', 'ac_unit']
  ]
  options: google.maps.MapOptions = {
      styles: this.retroMode,
      zoom: this.zoom,
      zoomControl: false,
      rotateControl: false,
      streetViewControl: false,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
    };

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

  setMapStyle(mapType: string) {
    let newMap: google.maps.MapOptions = {};
    switch (mapType) {
      case 'Retro': {
        newMap = {
          styles: this.retroMode,
        };
        break;
      }
      case 'Light': {
        newMap = {
          styles: this.lightMode,
        };
        break;
      }
      case 'Dark': {
        newMap = {
          styles: this.darkMode,
        };
        break;
      }
      case 'Night': {
        newMap = {
          styles: this.nightMode,
        };
        break;
      }
      case 'Silver': {
        newMap = {
          styles: this.silverMode,
        };
        break;
      }
      case 'Aubergine': {
        newMap = {
          styles: this.aubergineMode,
        };
        break;
      }
    }
    this.options = newMap;
  }

  changeType(newType: string) {
    const title = newType.split(' ')
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
    this.nearSearch.nearbySearch(this.placesRequest, results => {
      console.log(results);
      if (this.placesRequest.location !== this.location) {
        console.log(this.placesRequest.location + ' doesnt equal ' + this.location);
        return;
      }
      let city;
      this.placeCitySharer.getCityName().subscribe(cities => {
        city = cities;
      })
      if (city !== this.cityLocation) {
        return;
      }
      // resetting data
      this.searchMarkers = [];
      this.markerData.clear();
      console.log(this.location.toString());
      for (const result of results) {
       
        this.searchMarkers.push(this.createMarker(result));
        this.markerData.set(result.name, result.types);
      }
      this.placeCitySharer.setPlaces(this.markerData, this.placesRequest.type);
      this.changeDetector.detectChanges();
    });
  }

  createMarker(result: google.maps.places.PlaceResult) {
    return {
      position: result.geometry.location,
      title: result.name,
      icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      }
    };
  }

  openInfoWindow(marker: MapMarker) {
    this.activeMark = marker._marker.getTitle();
    this.infoWindow.open(marker);
    this.activeMarkerOutput.emit(this.activeMark);
  }

  private locationCallbackFail() {
    this.cityLocation = 'Los Angeles, CA, USA';
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
      console.log(this.location);
      this.placesRequestFunc(this.location);
    });
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(position => this.locationCallbackSuccess(position), this.locationCallbackFail);
    return this.position;
  }

  // gets our default location
  getCurrentOrSetLocation() {
    if (!this.location) {
      if (this.position) {
        this.location = new google.maps.LatLng(this.position);
      } else {
        this.cityLocation = 'Los Angeles, CA, USA';
        this.location = new google.maps.LatLng(34.0522, -118.2437);
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
           url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
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

  resetFilter() {
    this.activeMarkerOutput.emit('');
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
}
