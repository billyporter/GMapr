import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WikiSearchHandler {
  private static LINK = 'https://www.googleapis.com/customsearch/v1?';
  private static API_KEY = 'key=AIzaSyDI9uo_xPRWlgF9bSWnJl1xSbeb394tgTo';
  private static SEARCH_ENGINE = 'cx=015569016282384541059:opag6em0spe';

  constructor(private readonly http: HttpClient) {}

  // TODO: Add interface
  getQueryString(query: string) {
    const fullUrl =
      `${WikiSearchHandler.LINK}${WikiSearchHandler.API_KEY}&` +
      `${WikiSearchHandler.SEARCH_ENGINE}&` +
      `q=${query.split(' ').join('+')}&num=${1}`;
    return this.http
      .get(fullUrl)
      .pipe(
        map((data: any) => data.items[0].formattedUrl.match(/([^\/]+$)/g)[0])
      );
  }
}
