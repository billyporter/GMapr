import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GMapr';
  activeMarker: string;
  city: string;

  updateActiveMarker(newActiveMarker: string) {
    this.activeMarker = newActiveMarker;
  }
}
