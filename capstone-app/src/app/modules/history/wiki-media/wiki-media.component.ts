import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WikiSearchResult } from '../WikiSearchTemplate';
import { WikiServiceResult } from '../WikiServiceResult';
import { WikiResultsService } from '../wiki-results.service';
import { mergeMap, switchMap, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

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
  @Input() cityName!: string;

  constructor(private wikiService: WikiResultsService) { }

  ngOnInit(): void {
    this.getResults(this.cityName);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let change = changes['cityName'];

    if(!change.firstChange && change){
      this.getResults(this.cityName);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getResults(queryString: string) {
    this.wikiService.search(queryString)
      .subscribe((result: WikiServiceResult) => {
        if (result.history) {
          this.body = result.history;
          this.history = result.history;
          this.urls = result.furtherReading
          this.title = result.title;
          this.loading = false;
        }
        else {
          this.error = 'API did not return a valid response.';
          console.error('API did not return a valid response.');
        }
    });
  }
}
