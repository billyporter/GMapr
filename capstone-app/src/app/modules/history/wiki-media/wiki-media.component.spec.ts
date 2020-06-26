import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HTtpTestingController } from '@angular/common/http/testing';
import { WikiMediaComponent } from './wiki-media.component';

describe('WikiMediaComponent', () => {
  let component: WikiMediaComponent;
  let fixture: ComponentFixture<WikiMediaComponent>;
  let injector: TestBed;

  // We don't want to make actual http requests, allows us to do mocking and flushing.
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays location history', () => {
    component.getResults('Orlando, Florida');
    expect(body.toBeTruthy());
  });

  it('does not display location history', () => {
    component.getResults('');
    expect(!body.toBeTruthy());
  });

  it('displays location title', () => {
    component.getResults('Orlando, Florida');
    expect((wikiResult.parse.title).toEqual('Orlando, Florida'));
  });
});
