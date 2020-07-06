import { Component, OnInit, OnDestroy } from '@angular/core';
import { WikiSearchResult } from '../WikiSearchTemplate';
import { WikiResultsService } from '../wiki-results.service';
import { mergeMap, switchMap, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-wiki-media-history-section',
  templateUrl: './wiki-media.component.html',
  styleUrls: ['./wiki-media.component.scss']
})

export class WikiMediaComponent implements OnInit, OnDestroy {
  history: string;
  title: string;
  destroy$ = new Subject<void>();
  loading = true;
  body: string;
  urls = new Map();

  constructor(private wikiService: WikiResultsService) { }

  ngOnInit(): void {
    this.getResults('New York City');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getResults(queryString: string) {
    this.wikiService.search(queryString)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: {title: string, history: string, furtherReading: Map<string, string>}) => {
        this.history = result.history;
        console.log(result);
        this.urls = result.furtherReading
        this.title = result.title;
        if (this.history) {
          this.body = this.history;
          this.loading = false;
        }
        else {
          console.log('API did not return a valid response.');
        }
    });
  }
}
