import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';
import { WikiSearchHandler } from './services/wiki-search-handler.service';
import { Injectable } from '@angular/core';
import { WikiSearchResult } from './WikiSearchTemplate';
import { WikiServiceResult } from './WikiServiceResult';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import MockWikiResponse from 'testing/mock-wiki-response.json';

interface HistoryFixString{
  history: string[];
  furtherReading?: Map<string, string>;
}

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
  searchQuery : string;

  search(query: string, language: string, wordForHistory: string): Observable<WikiServiceResult> {
    return this.searchHandler
      .getQueryString(query)
      .pipe(
        switchMap((result) => {
          let url = "http://.en.wikipedia.org/wiki/" + result;
          this.searchQuery = result;
          return this.http.get<WikiSearchResult>(
            `${WikiResultsService.URL_BEGINNING}${language}${WikiResultsService.URL_MIDDLE}${result}${WikiResultsService.URL_END}`
          );
        }),
        map(history => {
          if (history.parse.text) {
            const langlinks = new Map<string, Map<string, string>>();
            for (let link of Object.values(history.parse.langlinks)) {
                let links = new Map<string, string>();
                links.set('langName', link.langname);
                links.set('url', link.url);
                links.set('searchQuery', link["*"]);
                langlinks.set(link.lang, links);
            }
            const historyResult = this.fixString(history.parse.text['*'], wordForHistory, language);
            const title = history.parse.title;
            const originalSearchQuery = this.searchQuery;
            return {title, ...historyResult, langlinks, originalSearchQuery};
          }
          else {
            throw new Error('API did not return a valid response');
          }
        }),
        catchError(() => {
          console.error('API did not return a valid response.');
          return of({title: '', history: ['']});
        })
      );
  }

  searchNewLang(query: string, language: string, wordForHistory: string): Observable<WikiServiceResult> {
    return this.http.get<WikiSearchResult>(
            `${WikiResultsService.URL_BEGINNING}${language}${WikiResultsService.URL_MIDDLE}${query}${WikiResultsService.URL_END}`
          ).pipe(map(history => {
          if (history.parse.text) {
            const langlinks = new Map<string, Map<string, string>>();
            for (const link of Object.values(history.parse.langlinks)) {
                const links = new Map<string, string>();
                links.set('langName', link.langname);
                links.set('url', link.url);
                links.set('searchQuery', link['*']);
                langlinks.set(link.lang, links);
            }
            const historyResult = this.fixString(history.parse.text['*'], wordForHistory, language);
            const title = history.parse.title;
            return {title, ...historyResult, langlinks};
          }
          else {
            throw new Error('API did not return a valid response');
          }
        }),
        catchError(() => {
          console.error('API did not return a valid response.');
          return of({title: '', history: ['']});
        })
      );
  }


  fixString(text: string, wordForHistory: string, language: string): HistoryFixString {
    let parsedText = text;
    const firstIndex = text.indexOf('<span class="mw-headline" id="'+ wordForHistory +'">');
    if (firstIndex !== -1){
      const firstPartOfString = text.substring(firstIndex, parsedText.length);
      const endIndex = firstPartOfString.indexOf('<h2>', 0);
      const startIndex = firstPartOfString.indexOf('</h2>', 0);
      parsedText = firstPartOfString.substring(startIndex, endIndex);
    }
    const paragraphs = parsedText.split('<p>');
    if (paragraphs.length > 9) {
      if (paragraphs[0].startsWith('</h2')) {
        parsedText = paragraphs.slice(1,10).join('----');
      }
      else {
        parsedText = paragraphs.slice(0,9).join('----');
      }
    }
    else {
      parsedText = paragraphs.join('----');
    }
    const regexForSourceNeeded = /<sup class="noprint Inline-Template Template-Fact"[\s\S]*?<\/sup>/gi;
    parsedText = parsedText.replace(regexForSourceNeeded, '');
    const furtherReading = this.findHrefs(parsedText, language);
    let tempHistory = parsedText;
    const regexForCatLinks = /class="catlinks[\s\S]*?<\/div>/gi;
    const regexForDabLinks = /<div class="dablink[\s\S]*?<\/div>/gi;
    const regexCaptions = /<a.*?<\/div><\/div><\/div>/gi;
    const regexParsing = /\.mw.*?}}/gi;
    const regexForH3 = /<h3>.*?<\/h3>/gi;
    const regexForULists = /<ul[\s\S]+?<\/ul>/gi;
    const regexForOLists = /<ol[\s\S]+?<\/ol>/gi;
    const regexForTables = /<table[\s\S]+?<\/table>/gi;
    const regexForNotes = /<div role="note"[\s\S]+?<\/div>/gi;
    const regexForCPUStats = /<!--[\s\S]*?-->/gi;
    const regexForCitationNeeded = /<span[\s\S]*?<\/span>/gi;
    const regexForRows = /<tr[\s\S]*?<\/tr>/gi;
    const regexForColumns = /<td[\s\S]*?<\/td>/gi;
    const regexForAllTags = /<[\s\S]*?>/gi;
    const regexForContentListDiv = /<div id="toc"[\s\S]*?<\/div>/gi;
    const regexForExtraColorAttributes = /\d*&.*?;/gi;
    const regexForRefrenceNumbers = /\[[\s\S]+?]/gi;
    const regexForAnyRemainingCSSStyling = /.mw-[\s\S]+?}/gi;
    const regexForDivStyleTags = /<div style=[\s\S]*?<\/div>/gi;
    tempHistory = tempHistory.replace(regexCaptions, '').replace(regexParsing, '').replace(regexForCatLinks, '>');
    tempHistory = tempHistory.replace(regexForOLists, '').replace(regexForULists, '').replace(regexForDabLinks, '');
    tempHistory = tempHistory.replace(regexForTables, '').replace(regexForNotes, '');
    tempHistory = tempHistory.replace(regexForRows, '').replace(regexForColumns, '');
    tempHistory = tempHistory.replace(regexForDivStyleTags, '');
    tempHistory = tempHistory.replace(regexForCPUStats, '').replace(regexForContentListDiv, '');
    tempHistory = tempHistory.replace(regexForRefrenceNumbers, '').replace(regexForCitationNeeded, '');
    tempHistory = tempHistory.replace(regexForAllTags, '').replace(regexForExtraColorAttributes, '');
    tempHistory = tempHistory.replace(regexForAnyRemainingCSSStyling, '');
    if(tempHistory.length < 500 && firstIndex !== -1) {
      text = text.replace('span class="mw-headline" id="', '');
      return this.fixString(text, wordForHistory, language);
    }
    const history = tempHistory.split('----');
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
        h.getAttribute('title') && h.getAttribute('title').startsWith('Edit') ||
        h.getAttribute('href').includes('=edit'))) {
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
