import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'capstone-app';
  activeMarker: string;
  city: string;
  markerData = new Map<string, string[]>();

  updateActiveMarker(newActiveMarker: string) {
    this.activeMarker = newActiveMarker;
  }

  updateMarkerData(newMarker: Map<string, string[]>) {
    this.markerData = newMarker;
  }

  cityUpdate(newCity: string) {
    this.city = newCity;
  }
}
