import MockWikiSearch from 'src/app/modules/history/assets/mock-wiki-search.json';
import MockWikiSearchBoston from 'src/app/modules/history/assets/mock-wiki-search-boston.json';
import MockWikiSearchChicago from 'src/app/modules/history/assets/mock-wiki-search-chicago.json';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockWikiHandlerService {

  getQueryString(query: string): Observable<any> {
    return of(MockWikiSearchChicago).pipe(
      map(data => data.items[0].formattedUrl.match(/([^\/]+$)/g)[0])
    );
  }
}
