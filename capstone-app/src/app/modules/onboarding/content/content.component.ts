import { Component, OnInit, ViewChild } from '@angular/core';
import { panelObject } from './../assets/panelObject';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  computerPhotos = ['assets/gmaprShort.gif', 'assets/mapsSearchbar.gif', 'assets/markerCustomBetter.gif',
    'assets/mapTypeThemes.gif', 'assets/markerPhotos.gif', 'assets/photoShort.gif', 'assets/language.gif', 'assets/furtherReadShort.gif'];
  mobilePhotos = ['assets/mobileGmapr.gif', 'assets/mobileSearch.gif', 'assets/mobileCustomMark.gif',
  'assets/mobileMapTheme.gif', 'assets/moblieMarkerPhotos.gif', 'assets/mobilePhotos.gif', 'assets/mobileLanguage.gif', 'assets/mobileFurtherReading.gif'];  
  displayPhotos: string[] = [];
  panelObjs = panelObject;
  ishidden = false;

  ngOnInit() {
    if (window.innerWidth < 600) {
      this.ishidden = true;
      this.displayPhotos = this.mobilePhotos;
    }
    else {
      this.ishidden = false;
      this.displayPhotos = this.computerPhotos;
    }
    for (let i = 0; i < this.displayPhotos.length; i++) {
      this.panelObjs[i].photos = this.displayPhotos[i];
    }
  }
}
