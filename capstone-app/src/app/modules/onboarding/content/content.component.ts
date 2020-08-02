import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  computerPhotos = ['assets/gmaprGen.gif', 'assets/mapsSearchbar.gif', 'assets/markerCustomBetter.gif',
    'assets/mapTypeThemes.gif', 'assets/photos.gif', 'assets/language.gif', 'assets/furtherReading.gif'];
  mobilePhotos = ['assets/mobileGmapr.gif', 'assets/mobileSearch.gif', 'assets/mobileCustomMark.gif',
  'assets/mobileMapTheme.gif', 'assets/mobilePhotos.gif', 'assets/mobileLanguage.gif', 'assets/mobileFurtherReading.gif'];  
  displayPhotos: string[] = [];
  panelObjs = [
    {
      title: 'GMapr Description',
      photos: '',
      description: 'Learn more about GMapr',
      paragraph: 'GMapr provides a snapshot in history of cities from over seventy-five years ago.',
    },
    {
      title: 'Maps Search Bar',
      photos: '',
      description: 'Learn more about the Maps search bar',
      paragraph: 'Use the search bar to search up any city in the world.',
    },
    {
      title: 'Map Custom Markers',
      photos: '',
      description: 'Learn more about how to make custom markers',
      paragraph: 'Click any on the map to create custom markers. To remove custom marker either use the remove all custom marker button or right click the custom marker.',
    },
    {
      title: 'Map Type/Themes',
      photos: '',
      description: 'Learn more about our different map types and themes',
      paragraph: 'Use the Marker Types button to change the search marker type. Use the Map Theme button to change the map color theme.',
    },
    {
      title: 'Photo Filter Feature',
      photos: '',
      description: 'Learn more about how we filter our photos',
      paragraph: 'Use the filter button to display photos by marker type',
    },
    {
      title: 'Language Feature',
      photos: '',
      description: 'Learn more about our language feature',
      paragraph: 'Use the languages button to change the display language of the History section',
    },
    {
      title: 'Further Reading',
      photos: '',
      description: 'Learn more about the Further Reading Feature',
      paragraph: 'Click on the further reading button to learn about history topic spoken about in the History section',
    }
  ]

  ngOnInit() {
    if (window.innerWidth < 600) {
      this.displayPhotos = this.mobilePhotos;
    }
    else {
      this.displayPhotos = this.computerPhotos;
    }
    for (let i = 0; i < this.displayPhotos.length; i++) {
      this.panelObjs[i].photos = this.displayPhotos[i];
    }
  }
}
