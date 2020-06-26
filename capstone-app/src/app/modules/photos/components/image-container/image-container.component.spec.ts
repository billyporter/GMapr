import { PhotoFetcher } from 'src/app/modules/photos/services/photo-fetcher.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImageContainerComponent } from './image-container.component';
import { Photo } from '../../photo-template';
import MockTestImages from 'testing/mock-image-response.json';
import { asyncData } from 'testing/async-observable-helpers';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';

describe('ImageContainerComponent', () => {
  let component: ImageContainerComponent;
  let fixture: ComponentFixture<ImageContainerComponent>;
  let testPhotos: Photo[];
  let getPhotosSpy: jasmine.Spy;

  beforeEach(async(() => {
    testPhotos = [
      {
        title: 'First Test',
        link: '../test1.jpeg',
        contextLink: 'test1.com',
        height: 3024,
        width: 4032,
      },
      {
        title: 'Second Test',
        link: '../test2.jpeg',
        contextLink: 'test2.com',
        height: 3024,
        width: 4032,
      },
    ];

    // Create a fake Photos Service with a getPhotos spy
    const photosService = jasmine.createSpyObj('PhotoFetcher', ['getPhotos']);
    // make the spy return a synchronou sobservable with test data
    getPhotosSpy = photosService.getPhotos.and.returnValue(of(MockTestImages));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ImageContainerComponent,
        { provide: PhotoFetcher, useValue: photosService },
      ],
      declarations: [ImageContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when test with asynchronous observable', () => {
    beforeEach(() => {
      getPhotosSpy.and.returnValue(asyncData(testPhotos));
    });

    it('should display a list of photos', () => {
      const bannerDe: DebugElement = fixture.debugElement;
      const bannerEl: HTMLElement = bannerDe.nativeElement;
      const imageList = bannerEl.querySelectorAll('img');
      const imageListLinks = Array.from(imageList)
        .filter((image) => !!image.src)
        .map((image) => `..${image.src.substring(21, image.src.length)}`);
      const testPhotosLinks = testPhotos
        .filter((testPhoto) => !!testPhoto)
        .map((testPhoto) => testPhoto.link);
      expect(imageListLinks).toEqual(testPhotosLinks);
    });

    it('should fetch correctly', () => {
      expect(component.photos).toEqual(testPhotos);
    });
  });
});
