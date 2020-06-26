import { TestBed } from '@angular/core/testing';

import { WikiResultsService } from './wiki-results.service';

describe('WikiResultsService', () => {
  let service: WikiResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikiResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
