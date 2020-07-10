import { PhotosModule } from './../../photos.module';
import { ImageContainerComponent } from './../image-container/image-container.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import MockTestImages from 'testing/mock-image-response.json';
import { of } from 'rxjs';
import { PhotosSectionComponent } from './photos-section.component';
import { PhotoFetcher } from '../../services/photo-fetcher.service';
import { By } from '@angular/platform-browser';

describe('PhotosSectionComponent', () => {
  let component: PhotosSectionComponent;
  let fixture: ComponentFixture<PhotosSectionComponent>;
  let loader: HarnessLoader;
  let getPhotosSpy: jasmine.Spy;

  beforeEach(async(() => {
    const photosService = jasmine.createSpyObj('PhotoFetcher', ['getPhotos']);
    getPhotosSpy = photosService.getPhotos.and.returnValue(of(MockTestImages));

    TestBed.configureTestingModule({
      declarations: [PhotosSectionComponent, ImageContainerComponent],
      imports: [PhotosModule],
      providers: [{ provide: PhotoFetcher, useValue: photosService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosSectionComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should ouput the value of the limit', async () => {
    const inputHarness = await loader.getHarness(
      MatInputHarness.with({ selector: '.limit-input' })
    );
    await inputHarness.setValue('10');
    const limit = await inputHarness.getValue();
    expect(limit).toEqual('10');
  });

  it('should show error message if not in range', async () => {
    component.city = 'Boston';
    fixture.detectChanges();
    const inputHarness = await loader.getHarness(
      MatInputHarness.with({ selector: '.limit-input' })
    );
    await inputHarness.setValue('15');
    component.limitControl.markAsTouched();
    fixture.detectChanges();
    expect(component.limitControl.invalid).toBe(true);
    const errorElement = fixture.debugElement.nativeElement.querySelector(
      'mat-error'
    );
    expect(errorElement.innerText).toContain('Must be between 1 and 10');
  });

  it('max should change when it receives new limit', () => {
    const myComponent = fixture.debugElement.query(
      By.directive(ImageContainerComponent)
    );
    myComponent.triggerEventHandler('limitChange', { max: 9, wasRemoved: 1 });
    expect(component.maxPhotos).toEqual(9);
  });
});
