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
  private static readonly URL_BEGINNING = 'https://'
  private static readonly URL_MIDDLE = '.wikipedia.org/w/api.php?origin=*&action=parse&page=';
  private static readonly URL_END = '&format=json';

  search(query: string, language: string, wordForHistory: string): Observable<WikiServiceResult> {
    return this.searchHandler
      .getQueryString(query)
      .pipe(
        switchMap((result) =>
          this.http.get<WikiSearchResult>(
            `${WikiResultsService.URL_BEGINNING}${language}${WikiResultsService.URL_MIDDLE}${result}${WikiResultsService.URL_END}`
          )
        ),map(history => {
          if (history.parse.text) {
            const langLinks = new Map<string, Map<string, string>>();
            for (let link of history.parse.langlinks) {
                let links = new Map<string, string>();
                links.set("langName", link.langname);
                links.set("url", link.url);
                links.set("searchQuery", link["*"]);
                langLinks.set(link.lang, links);
            }
            const historyResult = this.fixString(history.parse.text['*'], wordForHistory, language);
            const title = history.parse.title;
            return {title, ...historyResult, langLinks};
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

  searchNewLang(query: string, language: string, wordForHistory: string): Observable<WikiServiceResult> {
    return this.searchHandler
      .getQueryString(query)
      .pipe(
        switchMap((result) =>
          this.http.get<WikiSearchResult>(
            `${WikiResultsService.URL_BEGINNING}${language}${WikiResultsService.URL_MIDDLE}${query}${WikiResultsService.URL_END}`
          )
        ),map(history => {
          if (history.parse.text) {
            const langLinks = new Map<string, Map<string, string>>();
            for (let link of history.parse.langlinks) {
                let links = new Map<string, string>();
                links.set("langName", link.langname);
                links.set("url", link.url);
                links.set("searchQuery", link["*"]);
                langLinks.set(link.lang, links);
            }
            const historyResult = this.fixString(history.parse.text['*'], wordForHistory, language);
            const title = history.parse.title;
            return {title, ...historyResult, langLinks};
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


  fixString(text: string, wordForHistory: string, language: string): {history: string, furtherReading: Map<string, string>} {
    const firstIndex = text.indexOf('<span class="mw-headline" id="'+ wordForHistory +'">');
    let middleOfString = text;
    if (firstIndex !== -1){
      const firstPartOfString = text.substring(firstIndex, text.length);
      const endIndex = firstPartOfString.indexOf('<h2>', 0);
      const startIndex = firstPartOfString.indexOf('</h2>', 0);
      middleOfString = firstPartOfString.substring(startIndex, endIndex);
    }
    const paragraphs = middleOfString.split('<p>');
    if (paragraphs.length > 9) {
      if (paragraphs[0].startsWith('</h2')) {
        middleOfString = paragraphs.slice(1,10).join('');
      }
      else {
        middleOfString = paragraphs.slice(0,9).join('');
      }
    }
    const furtherReading = this.findHrefs(middleOfString, language);
    let history = middleOfString.split(/<h3>.*?<\/h3>/g).join('');
    history = history.split(/<.*?>/g).join('');
    history = history.split(/\d*&.*?;/g).join('');
    return {history, furtherReading};
  }

  findHrefs(text: string, languageAbreviation: string): Map<string, string> {
    const urls = new Map<string, string>();
    const el = document.createElement('p');
    el.innerHTML = text;
    const hrefs = Array.from(el.querySelectorAll('a'));
    let count = 1;
    for (const h of hrefs) {
      if (count <= 12 && !(h.getAttribute('href').charAt(0) === '#' ||
      (h.getAttribute('title') && h.getAttribute('title').startsWith('Edit')))) {
        const name = h.getAttribute('title');
        let url = h.getAttribute('href').toString();
        url = 'https://'+ languageAbreviation +'.wikipedia.org' + url;
        urls.set(url, name);
        count++;
      }
    }
    return urls;
  }
}
