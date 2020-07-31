import { Component, OnInit } from '@angular/core';
import { ContentComponent } from './modules/onboarding/content/content.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GMapr';
  activeMarker: string;
  city: string;

  constructor(public dialog: MatDialog) { }

  openDialog() {
    this.dialog.open(ContentComponent);
  }

  ngOnInit() {
    this.openDialog();
  }

  updateActiveMarker(newActiveMarker: string) {
    this.activeMarker = newActiveMarker;
  }
}
