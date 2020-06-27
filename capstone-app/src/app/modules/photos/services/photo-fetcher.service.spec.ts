import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PhotoFetcher } from './photo-fetcher.service';
import ExpectedResponse from 'src/app/modules/photos/assets/mock-images-one.json';

describe('PhotoFetcher', () => {
  let injector: TestBed;
  let photoService: PhotoFetcher;

  // because we don't want to make actual http requests, allows for mocking and flushing
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PhotoFetcher],
    });

    injector = getTestBed();
    photoService = injector.inject(PhotoFetcher);
    httpMock = injector.inject(HttpTestingController);
  });

  // verify there are no outstanding http calls
  afterEach(() => {
    httpMock.verify();
  });

  it('getPhotos() should return data', () => {
    photoService.getPhotos().subscribe((result) => {
      expect(result).toEqual(ExpectedResponse);
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('https://www.googleapis.com/customsearch/v1?')
    );
    expect(req.request.method).toBe('GET');
    req.flush(ExpectedResponse);
  });
});
