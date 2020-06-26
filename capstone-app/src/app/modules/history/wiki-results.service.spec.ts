import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WikiResultsService } from './wiki-results.service';

describe('WikiResultsService', () => {
  let service: WikiResultsService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ WikiResultsService ]
    });

    injector = getTestBed();
    service = injector.inject(WikiResultsService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('search(query) should return data', () => {
    service.search().subscribe((service) => {
      expect(service).toBeTruthy();
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=')
    );
    expect(req.request.method).toBe('GET');
    req.flush();
  });
});
