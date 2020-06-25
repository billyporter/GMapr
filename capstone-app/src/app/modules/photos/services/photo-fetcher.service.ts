import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoFetcher {

  private static LINK = 'https://www.googleapis.com/customsearch/v1?';
  private static API_KEY = 'key=AIzaSyDI9uo_xPRWlgF9bSWnJl1xSbeb394tgTo';
  private static SEARCH_ENGINE = 'cx=014012661603529902036:grbt2ttpety';
  private static SEARCH_TYPE = 'searchType=image';
  private query = 'q=phoenixville';
  private num = 'num=10';

  constructor(private readonly http: HttpClient) {}

  /* TODO(billyporter): Have getPhotos take arguments of query and num.
   * TODO(billyporter): Add handling for requests that fail and requests that return 0 results.
   */
  getPhotos(): Observable<any> {
    console.log('We here');
    const fullUrl = `${PhotoFetcher.LINK}${PhotoFetcher.API_KEY}&` +
                    `${PhotoFetcher.SEARCH_ENGINE}&${PhotoFetcher.SEARCH_TYPE}&` +
                    `${this.query}&${this.num}`;
    return this.http.get(fullUrl);
  }
}
