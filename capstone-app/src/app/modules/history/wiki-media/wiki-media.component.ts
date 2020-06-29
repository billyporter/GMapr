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
  wikiResult: WikiSearchResult;
  destroy$ = new Subject<void>();
  loading = true;
  body: string;
  constructor(private wikiService: WikiResultsService) { }

  ngOnInit(): void {
    this.getResults('Stillwater, Oklahoma');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getResults(queryString: string) {
    // TODO(sarahhud): Add error handling for wikipedia request and testing.
    this.wikiService.search(queryString)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: WikiSearchResult) => {
        this.wikiResult = result;
        if (this.wikiResult.parse.text) {
          this.body = this.fixString(result.parse.text["*"]);
          this.loading = false;
        }
        else {
          console.log("API did not return a valid response.");
        }
    });
  }

  fixString(text: string): string {
    let firstIndex = text.indexOf("<span class=\"mw-headline\" id=\"History\">History</span>", 0);
    if(firstIndex !== -1){
      let firstPartOfString = text.substring(firstIndex, text.length);
      let endIndex = firstPartOfString.indexOf("<h2>", 0);
      let startIndex = firstPartOfString.indexOf('</h2>', 0);
      let middleOfString = firstPartOfString.substring(startIndex, endIndex);
      let finalString = middleOfString.split('href="/wiki').join('target="_blank" href="https://en.wikipedia.org/wiki');
      finalString.split('title="Edit section: History">edit').join('>');
      return finalString;
    }
    console.log("The city page was found, but unfortunately there was no history paragraph found!");
    return text;
  }

}
