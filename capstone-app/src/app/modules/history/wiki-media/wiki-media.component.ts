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
  urls = new Map();

  constructor(private wikiService: WikiResultsService) { }

  ngOnInit(): void {
    this.getResults('New York City');
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
      let paragraphs = middleOfString.split('<p>');
      if (paragraphs.length > 6){
        middleOfString = paragraphs.slice(0,5).join('');
      }
      this.findHrefs(middleOfString);
      let history = middleOfString.split(/<.*?>/g).join("");
      return history.split(/&.*?;/g).join("");
    }
    console.log("The city page was found, but unfortunately there was no history paragraph found!");
    let history = text.split(/<.*?>/g).join("");
    return history.split(/&.*?;/g).join("");
  }

  findHrefs(text: string) {
    let el = document.createElement("p");
    el.innerHTML = text;
    let hrefs = Array.from(el.querySelectorAll("a"));
    let count = 1;
    for (let h of hrefs) {
      if (h.getAttribute('href').charAt(0) === '#' || h.getAttribute('title').startsWith('Edit')){
        delete hrefs[hrefs.indexOf(h)];
      }
      else if (count <= 15) {
        let name = h.getAttribute('title');
        let url = h.getAttribute('href').toString();
        url = "https://en.wikipedia.org" + url;
        this.urls.set(url, name);
        count ++;
      }
    }
  }
}
