import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PhotoFetcher {
  private static LINK = 'https://www.googleapis.com/customsearch/v1?';
  private static API_KEY = 'key=AIzaSyCd2vIkDcVuvM3ie4kE661cGS3GsH9IWcQ';
  private static SEARCH_ENGINE = 'cx=014012661603529902036:grbt2ttpety';
  private static SEARCH_TYPE = 'searchType=image';

  constructor(private readonly http: HttpClient) { }

  // TODO: Add interface
  getPhotos(query: string, limit: number): Observable<any> {
    const fullUrl =
      `${PhotoFetcher.LINK}${PhotoFetcher.API_KEY}&` +
      `${PhotoFetcher.SEARCH_ENGINE}&${PhotoFetcher.SEARCH_TYPE}&` +
      `q=${query.split(' ').join('+')}&num=${limit}`;
    return this.http.get(fullUrl).pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`${error.status}, body was ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Could not locate images');
  }
}
