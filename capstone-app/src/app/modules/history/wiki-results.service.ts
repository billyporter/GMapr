import { switchMap } from 'rxjs/operators';
import { WikiSearchHandler } from './services/wiki-search-handler.service';
import { Injectable } from '@angular/core';
import { WikiSearchResult } from './WikiSearchTemplate';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  search(query: string): Observable<WikiSearchResult> {
    return this.searchHandler
      .getQueryString(query)
      .pipe(
        switchMap((result) =>
          this.http.get<WikiSearchResult>(
            `${WikiResultsService.URL_BEGINNING}${result}${WikiResultsService.URL_END}`
          )
        )
      );
  }
}
