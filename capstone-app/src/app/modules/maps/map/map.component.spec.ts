import { MatMenuHarness } from '@angular/material/menu/testing';
/// <reference types="googlemaps" />
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { By } from '@angular/platform-browser';
import { SimpleChange, SimpleChanges } from '@angular/core';
import {MatSelectHarness} from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MapsModule } from '../maps.module';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedPlacesCityService } from 'src/app/services/shared-places-city.service';


// due to flaky testing sometimes these tests will fail due to undefined markers or map centers
describe('MapComponent', () => {
  let fixture: ComponentFixture<MapComponent>;
  let component: MapComponent;
  let service: SharedPlacesCityService;
  let injector: TestBed;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      imports: [ GoogleMapsModule, MapsModule, NoopAnimationsModule ],
      providers: [SharedPlacesCityService],
    })
    .compileComponents();
    injector = getTestBed();
    service = TestBed.inject(SharedPlacesCityService);
  }));

  // TODO: fix flaky testing issue
  // sometimes will fail due to undefined marker just refresh until it passes
  it('test multiple map marker click event', () => {
    const fixture = TestBed.createComponent(MapComponent);
    fixture.detectChanges();
    let coordinates: google.maps.LatLng;
    let lat = 26.011760;
    let lng = -80.139050;
    for (let i = 0; i < 5; i++) {
      coordinates = new google.maps.LatLng(lat, lng);
      lat++;
      lng++;
      fixture.componentInstance.markers.push({
        position: coordinates,
      });
    }
    fixture.detectChanges();

    const markerDebug = fixture.debugElement.queryAll(By.css('.custom-marker'));
    const markerComponent = markerDebug.map(marker => marker.componentInstance.getPosition());

    expect(markerComponent).toEqual(fixture.componentInstance.markers.map(marker => marker.position));
  });


  it('opens new info window when receives new active marker', () => {
    spyOn(component, 'getMarkerFromTitle');
    let holder: MapMarker;
    component.allMarkers = [holder, holder];
    const changesObj: SimpleChanges = {
      activeMark: new SimpleChange('', 'State House', false)
    };
    component.activeMark = 'State House';
    component.ngOnChanges(changesObj);
    expect(component.getMarkerFromTitle).toHaveBeenCalledWith(component.activeMark);
  });

  // TODO: fix flaky testing issue
  // will fail sometimes due to undefined remove property just refresh until it passes
  it('test delete button', () => {
    const fixture = TestBed.createComponent(MapComponent);
    fixture.detectChanges();
    let coordinates: google.maps.LatLng;
    let lat = 26.011760;
    let lng = -80.139050;
    for (let i = 0; i < 5; i++) {
      coordinates = new google.maps.LatLng(lat, lng);
      lat++;
      lng++;
      fixture.componentInstance.markers.push({
        position: coordinates,
      });
    }
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('.button-delete'));
    deleteButton.nativeElement.click();
    fixture.detectChanges();

    const markerDebug = fixture.debugElement.queryAll(By.css('.custom-marker'));
    const markerComponent = markerDebug.map(marker => marker.componentInstance.getPosition());
    expect(markerComponent.length).toEqual(0);
  });

  // TODO: fix flaky testing issue
  // sometimes will fail due to undefined marker just refresh until it passes
  it('test nearby search auto generated markers', () => {
    const fixture = TestBed.createComponent(MapComponent);
    fixture.detectChanges();
    //search Miami Gardens
    const searchLocation = new google.maps.LatLng(25.9420377, -80.2456045);
    const coordinates = [
      {lat: 25.96723, lng: -80.266204},
      {lat: 25.9420377, lng: -80.2456045},
      {lat: 25.9499743, lng: -80.20790439999999},
      {lat: 25.9774105, lng: -80.24748629999999},
      {lat: 25.9098525, lng: -80.2687515},
      {lat: 25.9544579, lng: -80.1978578},
      {lat: 25.9383788, lng: -80.2509212},
      {lat: 25.9636111, lng: -80.2530556},
      {lat: 25.9438492, lng: -80.22714599999999},
      {lat: 25.9424855, lng: -80.2543383},
      {lat: 25.9326195, lng: -80.2835547},
      {lat: 25.939876, lng: -80.287765},
      {lat: 25.9749119, lng: -80.2128896},
    ];

    spyOn(fixture.componentInstance.nearSearch, 'nearbySearch').and.callFake((request, callback) => {
      const results: google.maps.places.PlaceResult[] = coordinates.map(coordinate => {
        return {
          name: 'test place',
          formatted_address: 'test address',
          types: [],
          geometry: {
            location: new google.maps.LatLng(coordinate),
            viewport: undefined,
          },
        };
      });
      callback(results, undefined, undefined);
    });

    fixture.componentInstance.location = searchLocation;
    fixture.componentInstance.placesRequestFunc(searchLocation);

    const searchMarkers = fixture.componentInstance.searchMarkers.map(marker => {
      const position = marker.position as google.maps.LatLng;
      return position.toJSON();
    });

    expect(searchMarkers).toEqual(coordinates);
  });

  it('test geocoder', () => {
    const fixture = TestBed.createComponent(MapComponent);
    const placesService = jasmine.createSpyObj('SharedPlacesCityService', ['getPlacesSource', 'getCityName']);
    let coordinates: Coordinates = {
      latitude: 26.011761,
      longitude: -80.139053,
      accuracy: undefined,
      altitude: undefined,
      altitudeAccuracy: undefined,
      heading: undefined,
      speed: undefined,
    }
    let pos: Position = {
      coords: coordinates,
      timestamp: undefined,
    }
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(callback => {
      fixture.componentInstance.locationCallbackSuccess(pos);
    });
    const addresses = [
      '1405 N 12th Ct, Hollywood, FL 33019, USA',
      '1402 N 12th Ct, Hollywood, FL 33019, USA',
      '1598-1300 N 12th Ct, Hollywood, FL 33019, USA',
      'Hollywood Lakes, Hollywood, FL, USA',
      'Hollywood, FL 33019, USA',
      'Hollywood, FL, USA',
      'Broward County, FL, USA',
      'Florida, USA',
      'United States'
    ];
    const searchLocation = new google.maps.LatLng(26.011761, -80.139053);
    // let status: google.maps.GeocoderStatus;
    spyOn(fixture.componentInstance.geocoder, 'geocode').and.callFake(({location: searchLocation}, callback) => {
      let status: google.maps.GeocoderStatus = 'OK' as google.maps.GeocoderStatus;
      const results: google.maps.GeocoderResult[] = addresses.map((address, index) => {
        // locality helps find the closest city address
        return {
          formatted_address: address,
          types: index === 5 ? ['locality'] : [],
          partial_match: undefined,
          place_id: undefined,
          postcode_localities: undefined,
          address_components: undefined,
          geometry: {
            location: new google.maps.LatLng(26.011761, -80.139053),
            viewport: undefined,
            location_type: undefined,
            bounds: undefined,
          },
        };
      });
      callback(results, status)
    });
    spyOn(service, 'setCityName').and.callThrough();
    fixture.detectChanges();

    expect(service.setCityName).toHaveBeenCalled();
    expect(service.setCityName).toHaveBeenCalledWith(addresses[5]);
  });

  // TODO: update testing for mat menu themes
  it('test map theme select button', async () => {
    const fixture = TestBed.createComponent(MapComponent);
    fixture.detectChanges();
    let loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const menuHarness = await loader.getAllHarnesses(MatMenuHarness);
    expect(menuHarness[0]).toBeTruthy();
  });

  // TODO: update testing for mat menu types
  it('test types select button', async () => {
    const fixture = TestBed.createComponent(MapComponent);
    fixture.detectChanges();
    let loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const menuHarness = await loader.getAllHarnesses(MatMenuHarness);
    expect(menuHarness[1]).toBeTruthy();
  });

  // TODO: fix flaky testing issue
  // sometimes will fail do to an undefined map center just refresh until it passs
  it('sets center and zoom of the map', () => {
    const options = {center: {lat: 26.011760, lng: -80.139050}, zoom: 13};

    const fixture = TestBed.createComponent(MapComponent);
    fixture.componentInstance.location = new google.maps.LatLng(options.center);
    fixture.componentInstance.zoom = options.zoom;
    fixture.detectChanges();

    const mapDebug = fixture.debugElement.query(By.css('.map'));
    const mapComp = mapDebug.componentInstance;
    fixture.detectChanges();

    expect(mapComp.getCenter().toJSON()).toEqual(options.center);
    expect(mapComp.getZoom()).toEqual(13);
  });
});
