import { Component, OnInit, OnDestroy } from '@angular/core';
import { WikiSearchResult } from '../WikiSearchTemplate';
import { WikiResultsService } from '../wiki-results.service';
import { mergeMap, switchMap, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
    this.getResults();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getResults() {
    this.wikiService.search('Orlando, Florida').pipe(takeUntil(this.destroy$)).subscribe((result: WikiSearchResult) => {
      this.wikiResult = result;
      this.body = this.fixString(result.parse.text["*"]);
      this.loading = false;
    });
  }

  fixString(text: string): string {
    var firstIndex = text.indexOf("<span class=\"mw-headline\" id=\"History\">History</span>", 0);
    var firstPartOfString = text.substring(firstIndex, text.length);
    var endIndex = firstPartOfString.indexOf("<h2>", 0);
    var startIndex = firstPartOfString.indexOf('</h2>', 0);
    var middleOfString = firstPartOfString.substring(startIndex, endIndex);
    var finalString = middleOfString.split('href="/wiki').join('target="_blank" href="https://en.wikipedia.org/wiki');
    finalString.split('title="Edit section: History">edit').join('>');
    return finalString;
  }

}
