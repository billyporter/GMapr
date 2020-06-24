import { Injectable } from '@angular/core';
import { WikiSearchResult } from './WikiSearchTemplate';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WikiResultsService {
  constructor(private readonly http: HttpClient) {}
  query: string;
  urlBeginning = 'https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=';
  urlEnd = '&format=json';
  
  search(query: string): Observable<WikiSearchResult> {
    const url = this.urlBeginning + query + this.urlEnd;
    return this.http.get<WikiSearchResult>(this.url);
  }
}
