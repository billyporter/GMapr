import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WikiResultsService } from './wiki-results.service';
import { WikiSearchResult } from './WikiSearchTemplate';

const testWikiResult = {
    parse: {
      title: 'Stillwater, Oklahoma',
      text: {
        '*' : '</h2><p>The north-central region of Oklahoma became part of the United States'
        + 'with the <a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Louisiana_Purchase\"'
        + 'title=\"Louisiana Purchase\">Louisiana Purchase</a> in 1803. In 1832, author and traveler'
        +  '<a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Washington_Irving\" title=\"Washington'
        + 'Irving\">Washington Irving</a> provided the first recorded description of the area around'
        + 'Stillwater in his book <i>A Tour on the Prairies</i>. He wrote of “a glorious prairie spreading'
        + 'out beneath the golden beams of an autumnal sun. The deep and frequent traces of buffalo,'
        + 'showed it to be a one of their favorite grazing grounds.”<sup id=\"cite_ref-9\" class=\"reference'
        +'\"><a href=\"#cite_note-9\">&#91;9&#93;</a></sup></p>'
      }
    }
  }

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
    service.search('Stillwater, Oklahoma').subscribe((service) => {
      expect(service).toBeTruthy();
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=')
    );
    expect(req.request.method).toBe('GET');
    req.flush(testWikiResult);
  });
});
