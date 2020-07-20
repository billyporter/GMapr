/// <reference types="googlemaps" />
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { By } from '@angular/platform-browser';
import { SimpleChange, SimpleChanges } from '@angular/core';

// due to flaky testing sometimes these tests will fail due to undefined markers or map centers
describe('MapComponent', () => {
  let fixture: ComponentFixture<MapComponent>;
  let component: MapComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      imports: [ GoogleMapsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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

    const deleteButton = fixture.debugElement.query(By.css('.buttonDelete'));
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
