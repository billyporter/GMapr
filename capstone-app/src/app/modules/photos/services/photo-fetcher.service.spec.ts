import { TestBed } from '@angular/core/testing';

import { PhotoFetcher } from './photo-fetcher.service';

describe('PhotoFetcher', () => {
  let service: PhotoFetcher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoFetcher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
