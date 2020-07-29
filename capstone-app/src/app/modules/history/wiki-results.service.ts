import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';
import { WikiSearchHandler } from './services/wiki-search-handler.service';
import { Injectable } from '@angular/core';
import { WikiSearchResult } from './WikiSearchTemplate';
import { WikiServiceResult } from './WikiServiceResult';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import MockWikiResponse from 'testing/mock-wiki-response.json';

@Injectable({
  providedIn: 'root',
})
export class WikiResultsService {

  constructor(
    private readonly http: HttpClient,
    private searchHandler: WikiSearchHandler
  ) {}
  private static readonly URL_BEGINNING =
    'https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=';
  private static readonly URL_END = '&format=json';

  search(query: string): Observable<WikiServiceResult> {
    return this.searchHandler
      .getQueryString(query)
      .pipe(
        switchMap((result) =>
          this.http.get<WikiSearchResult>(
            `${WikiResultsService.URL_BEGINNING}${result}${WikiResultsService.URL_END}`
          )
        ),
        map(history => {
          if (history.parse.text) {
            const historyResult = this.fixString(history.parse.text['*']);
            const title = history.parse.title;
            return {title, ...historyResult};
          }
          else {
            throw new Error("API did not return a valid response");
          }
        }),
        catchError(() => {
          console.error('API did not return a valid response.');
          return of({title: '', history: ''});
        })
      );
  }

  fixString(text: string): {history: string, furtherReading?: Map<string, string>} {
    const regexCaptions = /<a.*?<\/div><\/div><\/div>/gi;
    const regexParsing = /\.mw.*?}}/gi;
    const parsedText = text.replace(regexCaptions, '').replace(regexParsing, '');
    const firstIndex = parsedText.indexOf('<span class="mw-headline" id="History">History</span>', 0);
    if (firstIndex !== -1){
      const firstPartOfString = parsedText.substring(firstIndex, parsedText.length);
      const endIndex = firstPartOfString.indexOf('<h2>', 0);
      const startIndex = firstPartOfString.indexOf('</h2>', 0);
      let middleOfString = firstPartOfString.substring(startIndex, endIndex);
      const paragraphs = middleOfString.split('<p>');
      if (paragraphs.length > 9) {
        if (paragraphs[0].startsWith('</h2')) {
          middleOfString = paragraphs.slice(1,10).join('\n');
        }
        else {
          middleOfString = paragraphs.slice(0,9).join('\n');
        }
      }
      const furtherReading = this.findHrefs(middleOfString);
      let history = middleOfString.split(/<h3>.*?<\/h3>/g).join('');
      const regexNewLine = /(\n)(\n)+/gi;
      history = history.replace(regexNewLine, '');
      history = history.split(/<.*?>/g).join('');
      history = history.split(/\d*&.*?;/g).join('');
      return {history, furtherReading};
    }
    console.error('The city page was found, but unfortunately there was no history paragraph found!');
    let history = text.split(/<h3>.*?<\/h3>/g).join('');
    history = history.split(/<.*?>/g).join('');
    history = history.split(/\d*&.*?;/g).join('');
    return {history};
  }

  findHrefs(text: string): Map<string, string> {
    const urls = new Map<string, string>();
    const el = document.createElement('p');
    el.innerHTML = text;
    const hrefs = Array.from(el.querySelectorAll('a'));
    let count = 1;
    for (const h of hrefs) {
      if (count <= 12 && !(h.getAttribute('href').charAt(0) === '#' || (h.getAttribute('title') && h.getAttribute('title').startsWith('Edit')))) {
        const name = h.getAttribute('title');
        let url = h.getAttribute('href').toString();
        url = 'https://en.wikipedia.org' + url;
        urls.set(url, name);
        count++;
      }
    }
    return urls;
  }
}
