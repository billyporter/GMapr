import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { WikiServiceResult } from '../WikiServiceResult';
import { WikiResultsService } from '../wiki-results.service';
import { Subject } from 'rxjs';
import { SharedPlacesCityService } from 'src/app/services/shared-places-city.service';

@Component({
  selector: 'app-wiki-media-history-section',
  templateUrl: './wiki-media.component.html',
  styleUrls: ['./wiki-media.component.scss']
})

export class WikiMediaComponent implements OnChanges, OnInit {
  history: string;
  title: string;
  error: string;
  destroy$ = new Subject<void>();
  loading = true;
  body: string;
  urls = new Map();
  cityName: string;

  constructor(private cd: ChangeDetectorRef, private cityFetcher: SharedPlacesCityService, private wikiService: WikiResultsService) { }

  ngOnInit(): void {
    this.cityFetcher.getCityName().subscribe(city => {
      this.cityName = city;
      if (city) {
        this.getResults(this.cityName);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes.cityName;

    if (!change.firstChange && change){
      this.getResults(this.cityName);
    }
  }

  getResults(queryString: string) {
    const currentQuery = queryString;
    let isOldRequest = false;
    this.wikiService.search(queryString)
      .subscribe((result: WikiServiceResult) => {
        if (result.history && currentQuery === this.cityName) {
            isOldRequest = true;
            this.body = result.history;
            this.history = result.history;
            this.urls = result.furtherReading;
            this.title = result.title;
            this.loading = false;
            this.cd.detectChanges();
        }
        else if (!isOldRequest) {
          this.error = 'API did not return a valid response.';
          console.error('API did not return a valid response.');
        }
    });
  }
}
