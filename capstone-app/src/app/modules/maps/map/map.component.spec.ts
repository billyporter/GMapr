/// <reference types="googlemaps" />
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { By } from '@angular/platform-browser';


describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      imports: [ GoogleMapsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    // const fixture = TestBed.createComponent(MapComponent);
    // const app = fixture.componentInstance;
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('test map marker click event', () => {
    const fixture = TestBed.createComponent(MapComponent);
    fixture.detectChanges();

    const coordinates = new google.maps.LatLng({lat: 26.011760, lng:  -80.139050});

    fixture.componentInstance.markers.push(coordinates);
    fixture.detectChanges();

    const markerDebug = fixture.debugElement.query(By.css('.marker'));
    const markerComponent = markerDebug.componentInstance;

    expect(markerComponent.getPosition()).toEqual(coordinates);
  });

  it('test multiple map marker click event', () => {
    const fixture = TestBed.createComponent(MapComponent);
    fixture.detectChanges();
    let coordinates: google.maps.LatLng;
    let lat = 26.011760;
    let lng = -80.139050
    for (let i = 0; i < 5; i++) {
      coordinates = new google.maps.LatLng(lat, lng);
      lat++;
      lng++;
      fixture.componentInstance.markers.push(coordinates);
      fixture.detectChanges();
    }

    const markerDebug = fixture.debugElement.queryAll(By.css('.marker'));
    const markerComponent = markerDebug.map(marker => marker.componentInstance.getPosition());

    expect(markerComponent).toEqual(fixture.componentInstance.markers);
  });


  it('sets center and zoom of the map', () => {
    const options = {center: {lat: 26.011760, lng:  -80.139050}, zoom: 13};

    const fixture = TestBed.createComponent(MapComponent);
    fixture.componentInstance.location = new google.maps.LatLng(options.center);
    fixture.componentInstance.zoom = options.zoom;
    fixture.detectChanges();

    fixture.componentInstance.location = new google.maps.LatLng({lat: 4.624335, lng: -74.063644});
    fixture.componentInstance.zoom = 12;
    fixture.detectChanges();

    expect(fixture.componentInstance.location.toJSON()).toEqual({lat: 4.624335, lng: -74.063644});
    expect(fixture.componentInstance.zoom).toEqual(12);
  });
});
