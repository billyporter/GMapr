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
  darkMode: google.maps.MapTypeStyle[] = [
    {
      elementType: "geometry",
      stylers: [
        {
          "color": "#212121"
        }
      ]
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          "visibility": "off"
        }
      ]
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#757575"
        }
      ]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#212121"
        }
      ]
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          "color": "#757575"
        }
      ]
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [
        {
          "visibility": "off"
        }
      ]
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#757575"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          "color": "#181818"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#616161"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          "color": "#373737"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#616161"
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#757575"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          "color": "#000000"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ];
  retroMode: google.maps.MapTypeStyle[] = [
    {
      elementType: "geometry",
      stylers: [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#523735"
        }
      ]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#447530"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#92998d"
        }
      ]
    }
  ];
  lightMode: google.maps.MapTypeStyle[] = [];
  silverMode: google.maps.MapTypeStyle[] = [
    {
      elementType: "geometry",
      stylers: [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          "visibility": "off"
        }
      ]
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#616161"
        }
      ]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#757575"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#757575"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#616161"
        }
      ]
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ];
  nightMode: google.maps.MapTypeStyle[] = [
    {
      elementType: "geometry",
      stylers: [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#746855"
        }
      ]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          "color": "#746855"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#17263c"
        }
      ]
    }
  ];
  aubergineMode: google.maps.MapTypeStyle[] = [
    {
      elementType: "geometry",
      stylers: [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          "color": "#255763"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ];
  mapTypes = ['Aubergine', 'Dark', 'Light', 'Night', 'Retro', 'Silver'];
  options: google.maps.MapOptions = {
  }

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
    if (mapType.includes('Retro')) {
      const newMap: google.maps.MapOptions = {
        styles: this.retroMode,
      }
      this.options = newMap;
    }
    else if (mapType.includes('Dark')) {
      const newMap: google.maps.MapOptions = {
        styles: this.darkMode,
      }
      this.options = newMap;
    }
    else if (mapType.includes('Light')) {
      const newMap: google.maps.MapOptions = {
        styles: this.lightMode,
      }
      this.options = newMap;
    }
    else if (mapType.includes('Silver')) {
      const newMap: google.maps.MapOptions = {
        styles: this.silverMode,
      }
      this.options = newMap;
    }
    else if (mapType.includes('Night')) {
      const newMap: google.maps.MapOptions = {
        styles: this.nightMode,
      }
      this.options = newMap;
    }
    else if (mapType.includes('Aubergine')) {
      const newMap: google.maps.MapOptions = {
        styles: this.aubergineMode,
      }
      this.options = newMap;
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
    this.nearSearch.nearbySearch(this.placesRequest, results => {
      // resetting data
      this.searchMarkers = [];
      this.markerData.clear();
      for (const result of results) {
        this.searchMarkers.push(this.createMarker(result));
        this.markerData.set(result.name, result.types);
      }
      this.placeCitySharer.setPlaces(this.markerData);
      this.changeDetector.detectChanges();
    });
  }

  createMarker(result: google.maps.places.PlaceResult) {
    return {
      position: result.geometry.location,
      title: result.name,
      icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
      }
    };
  }

  openInfoWindow(marker: MapMarker) {
    this.activeMark = marker._marker.getTitle();
    this.infoWindow.open(marker);
    this.activeMarkerOutput.emit(this.activeMark);
  }

  private locationCallbackFail() {
    this.cityLocation = 'Los Angeles, CA, USA'
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
}
