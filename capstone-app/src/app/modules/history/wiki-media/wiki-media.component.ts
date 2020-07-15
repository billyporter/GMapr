import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { mergeMap, switchMap, map, takeUntil } from 'rxjs/operators';
import { WikiSearchResult } from '../WikiSearchTemplate';
import { WikiServiceResult } from '../WikiServiceResult';
import { WikiResultsService } from '../wiki-results.service';
import { HttpClientModule } from '@angular/common/http';
import Languages from '../languages-word-for-history.json';
import { Subject } from 'rxjs';

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
  langLinks = new Map();
  languages: any = Languages as any;

  @Input() cityName!: string;

  constructor(private wikiService: WikiResultsService) { }

  ngOnInit(): void {
    this.getResults(this.cityName);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes.cityName;

    if (!change.firstChange && change){
      this.getResults(this.cityName);
    }
  }

  getResults(queryString: string) {
    this.wikiService.search(queryString, 'en', 'History')
      .subscribe((result: Observable<WikiServiceResult>) => {
        if (result.history) {
          this.body = result.history;
          this.history = result.history;
          this.urls = result.furtherReading;
          this.title = result.title;
          this.loading = false;
          this.langLinks = result.langLinks;

          let prefix = "fr";
          const language = this.langLinks.get(prefix);
          const query = language.get("searchQuery");
          const wordForHistory = this.languages[prefix];
          console.log("Language Changed!");
          console.log(language, query, wordForHistory);
          this.changeLanguage(query, prefix, wordForHistory);
        }
        else {
          this.error = 'API did not return a valid response.';
          console.error('API did not return a valid response.');
        }
    });
  }

  changeLanguage(queryString: string, languagePrefix: string, wordForHistory: string) {
    this.wikiService.search(queryString, languagePrefix, wordForHistory)
      .pipe()
      .subscribe((result: Observable<WikiServiceResult>) => {
        this.history = result.history;
        this.urls = result.furtherReading
        this.title = result.title;
        this.langLinks = result.langLinks;
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
