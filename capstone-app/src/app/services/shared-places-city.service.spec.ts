import { TestBed, getTestBed } from '@angular/core/testing';
import { SharedPlacesCityService } from './shared-places-city.service';

describe('SharedPlacesCityService', () => {
  let service: SharedPlacesCityService;
  let injector: TestBed;
  const testMarkerPlaces = new Map<string, string[]>();

  beforeEach(() => {
    testMarkerPlaces.set('Pjs Wings', ['Restaurant']);
    testMarkerPlaces.set('Colonial Theater', ['History', 'Entertainment']);
    testMarkerPlaces.set('Valley Forge', ['History', 'Landmark']);

    TestBed.configureTestingModule({
      providers: [SharedPlacesCityService],
    });
    injector = getTestBed();
    service = TestBed.inject(SharedPlacesCityService);
  });

  it('set should change cityName, get should return cityName', () => {
    service.setCityName('Boston');
    service.getCityName().subscribe(result => {
      expect(result).toBe('Boston');
    });
  });
  it('set should change markerPlaces, get should return markerPlaces', () => {
    service.setPlaces(testMarkerPlaces, 'Tourist Attraction');
    service.getPlacesSource().subscribe(result => {
      expect(result).toBe(testMarkerPlaces);
    });
  });
});
