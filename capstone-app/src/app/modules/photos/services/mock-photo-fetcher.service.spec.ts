import { TestBed } from '@angular/core/testing';

import { MockPhotoFetcher } from './mock-photo-fetcher.service';

describe('MockPhotoFetcher', () => {
  let service: MockPhotoFetcher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockPhotoFetcher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
