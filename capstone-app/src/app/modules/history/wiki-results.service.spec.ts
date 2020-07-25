import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WikiResultsService } from './wiki-results.service';
import { WikiSearchResult } from './WikiSearchTemplate';
import MockWikiResponse from 'testing/mock-wiki-response.json';

const title = 'Stillwater, Oklahoma';
const history = 'The north-central region of Oklahoma became part of the United '
              + 'States with the Louisiana Purchase in 1803. In 1832, author and '
              + 'traveler Washington Irving provided the first recorded description '
              + 'of the area around Stillwater in his book A Tour on the Prairies. '
              + 'He wrote of “a glorious prairie spreading out beneath the golden '
              + 'beams of an autumnal sun. The deep and frequent traces of buffalo, '
              + 'showed it to be a one of their favorite grazing grounds.”';
const furtherReading = new Map<string, string>();
furtherReading.set("https://en.wikipedia.org/wiki/Louisiana_Purchase","Louisiana Purchase");
furtherReading.set("https://en.wikipedia.org/wiki/Washington_Irving","Washington Irving");
const testFixStringResponse = {history, furtherReading};
const testResponse = {title, history, furtherReading};

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
    service.search('Stillwater, Oklahoma', 'en', 'History').subscribe((result) => {
      expect(result).toBeTruthy();
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('https://www.googleapis.com/customsearch/v1')
    );
    expect(req.request.method).toBe('GET');
    req.flush(testResponse);
  });

  it('searchNewLang(query) should return data', () => {
    service.searchNewLang('Stillwater, (Oklahoma)', 'de', 'Geschichte').subscribe((result) => {
      expect(result).toBeTruthy();
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('https://de.wikipedia.org/')
    );
    expect(req.request.method).toBe('GET');
    req.flush(testResponse);
  });

  it('should format the string properly', () => {
    expect(service.fixString(MockWikiResponse.parse.text['*'], 'History', 'en'))
    .toEqual(testFixStringResponse);
  });
});
