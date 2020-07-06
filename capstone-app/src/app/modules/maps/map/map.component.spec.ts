/// <reference types="googlemaps" />
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { GoogleMapsModule } from '@angular/google-maps';


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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the app', () => {
    // const fixture = TestBed.createComponent(MapComponent);
    // const app = fixture.componentInstance;
    expect(fixture.componentInstance).toBeTruthy();
  });
});
