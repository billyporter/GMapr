import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoFetcher {

  private url = 'https://www.googleapis.com/customsearch/v1?';
  private apiKey = 'key=AIzaSyDI9uo_xPRWlgF9bSWnJl1xSbeb394tgTo';
  private searchEngine = 'cx=014012661603529902036:grbt2ttpety';
  private searchType = 'searchType=image';
  private query = 'q=boston+1900';
  private num = 'num=10';
  private fullURL = '';
  constructor(private readonly http: HttpClient) {}

  getPhotos(): Observable<any> {
    this.fullURL = `${this.url}${this.apiKey}&${this.searchEngine}&${this.searchType}&${this.query}&${this.num}`;
    return this.http.get(this.fullURL);
  }
}
