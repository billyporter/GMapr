import { mergeMap, switchMap, map, takeUntil } from 'rxjs/operators';
import { WikiSearchResult } from '../WikiSearchTemplate';
import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { WikiServiceResult } from '../WikiServiceResult';
import { WikiResultsService } from '../wiki-results.service';
import { HttpClientModule } from '@angular/common/http';
import Languages from '../languages-word-for-history.json';
import { Subject } from 'rxjs';
import { SharedPlacesCityService } from 'src/app/services/shared-places-city.service';

interface LanguageData {
  [language: string]: AllLanguages;
}

interface AllLanguages {
  ["FullLangName"]: string,
  ["WordForHistory"]: string
}

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
  langlinks = new Map();
  languages: LanguageData = Languages as LanguageData;
  query: string;
  prevQuery: string;
  prevWordForHistory: string;
  prevPreFix: string;

  @Input() cityName!: string;

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
    this.wikiService.search(queryString, 'en', 'History')
      .subscribe((result: WikiServiceResult) => {
        this.error = "";
        if (result.history && currentQuery === this.cityName) {
          this.body = result.history;
          this.history = result.history;
          this.urls = result.furtherReading;
          this.title = result.title;
          this.loading = false;
          this.langlinks = result.langlinks;
          const language = this.langlinks.get('ca');
          this.prevQuery = language.get('searchQuery');
          this.prevWordForHistory = 'History';
          this.prevPreFix = 'en';
          this.cd.detectChanges();
        }
        else if (!isOldRequest) {
          this.error = 'API did not return a valid response.';
          console.error('API did not return a valid response.');
        }
    });
  }

  changeLanguage(queryString: string, languagePrefix: string, wordForHistory: string) {
    this.wikiService.searchNewLang(queryString, languagePrefix, wordForHistory)
      .subscribe((result: WikiServiceResult) => {
        this.error = "";
        this.history = result.history;
        if (!this.history){
          this.loading = true;
          this.error = 'Unfortunately, the language you requested does not have an available tranlation '
          + 'for this page. Please select a different language.';
        }
        else {
          this.body = this.history;
          this.loading = false;
          this.title = result.title;
          this.urls = result.furtherReading;
          if(result.langlinks && result.langlinks.size > 0) {
              this.langlinks = result.langlinks;
          }
        }
        if (this.history.includes("CPU time usage:")){
          this.loading = false;
          this.error = 'Unfortunately, the language you requested has not been fully translated. '
          + 'The data being shown is what the Wikipedia page returned.';
        }
    });
  }

  onChangeLanguage(prefix: string) {
    if (prefix === this.prevPreFix) {
      this.changeLanguage(this.prevQuery, this.prevPreFix, this.prevWordForHistory);
    }
    else if (prefix === 'en' && !this.langlinks.get('en')) {
      this.prevPreFix = prefix;
      const language = this.langlinks["ca"];
      this.query = language["searchQuery"];
      this.prevQuery = this.query;
      this.prevWordForHistory = 'History';
      this.changeLanguage(this.query, 'en', 'History');
    }
    else {
      const language = this.langlinks.get(prefix);
      this.prevPreFix = prefix;
      this.query = language.get('searchQuery');
      this.prevQuery = this.query;
      const wordForHistory = this.languages[prefix]["WordForHistory"];
      console.log(this.languages[prefix]["WordForHistory"]);
      this.prevWordForHistory = wordForHistory;
      this.changeLanguage(this.query, prefix, wordForHistory);
    }
  }
}
