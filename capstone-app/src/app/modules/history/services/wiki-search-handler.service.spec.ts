import { TestBed, getTestBed } from '@angular/core/testing';
import { WikiSearchHandler } from './wiki-search-handler.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('WikiSearchHandler', () => {
  let injector: TestBed;
  let wikiService: WikiSearchHandler;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WikiSearchHandler],
    });
    injector = getTestBed();
    wikiService = injector.inject(WikiSearchHandler);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getPhotos() should return correct data', () => {
    wikiService.getQueryString('Stillwater Ok').subscribe((result) => {
      expect(result).toEqual('Stillwater,_Oklahoma');
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('https://www.googleapis.com/customsearch/v1?')
    );
    expect(req.request.method).toBe('GET');
    req.flush('Stillwater,_Oklahoma');
  });
});
