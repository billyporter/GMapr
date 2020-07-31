import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  computerPhotos = ['assets/gmaprGen.gif', 'assets/mapsSearchbar.gif', 'assets/markerCustomBetter.gif',
    'assets/mapTypeThemes.gif', 'assets/photos.gif', 'assets/language.gif', 'assets/furtherReading.gif'];
  mobilePhotos = [];
  displayyPhotos: string[] = [];

  ngOnInit() {

  }
}
