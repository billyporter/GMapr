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
        console.log(result);
        if (this.wikiResult.parse.text) {
          this.body = this.fixString(result.parse.text["*"]);
          console.log(this.fixString("<h2><span class=\"mw-headline\" id=\"History\">History</span><span class=\"mw-editsection\"><span class=\"mw-editsection-bracket\">[</span><a href=\"/w/index.php?title=Stillwater,_Oklahoma&amp;action=edit&amp;section=1\" title=\"Edit section: History\">edit</a><span class=\"mw-editsection-bracket\">]</span></span></h2><p>The north-central region of Oklahoma became part of the United States with the <a href=\"/wiki/Louisiana_Purchase\" title=\"Louisiana Purchase\">Louisiana Purchase</a> in 1803. In 1832, author and traveler <a href=\"/wiki/Washington_Irving\" title=\"Washington Irving\">Washington Irving</a> provided the first recorded description of the area around Stillwater in his book <i>A Tour on the Prairies</i>. He wrote of “a glorious prairie spreading out beneath the golden beams of an autumnal sun. The deep and frequent traces of buffalo, showed it to be a one of their favorite grazing grounds.”<sup id=\"cite_ref-9\" class=\"reference\"><a href=\"#cite_note-9\">&#91;9&#93;</a></sup></p><h2>More data that should not be represented!</h2>"));
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
    //  text = middleOfString.split(/<a.*?\/a>/g).join("");
      let history = middleOfString.split(/<.*?>/g).join("");
      return history.split(/&.*?;/g).join("");
    }
    console.log("The city page was found, but unfortunately there was no history paragraph found!");
    let history = text.split(/<.*?>/g).join("");
    return history.split(/&.*?;/g).join("");
  }

}
