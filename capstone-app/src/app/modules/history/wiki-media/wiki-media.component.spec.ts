import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WikiMediaComponent } from './wiki-media.component';
import MockWikiResponse from 'testing/mock-wiki-response.json';
import { asyncData } from 'testing/async-observable-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { WikiResultsService } from '../wiki-results.service';
import { WikiSearchResult } from '../WikiSearchTemplate';

describe('WikiMediaComponent', () => {
  let component: WikiMediaComponent;
  let fixture: ComponentFixture<WikiMediaComponent>;
  let testWikiResult: WikiSearchResult;
  let getWikiResponseSpy: jasmine.Spy;

  beforeEach(async(() => {
    testWikiResult = {
        parse: {
          title: 'Stillwater, Oklahoma',
          text: {
            '*' : "</h2><p>The north-central region of Oklahoma became part of the United States with the <a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Louisiana_Purchase\" title=\"Louisiana Purchase\">Louisiana Purchase</a> in 1803. In 1832, author and traveler <a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Washington_Irving\" title=\"Washington Irving\">Washington Irving</a> provided the first recorded description of the area around Stillwater in his book <i>A Tour on the Prairies</i>. He wrote of “a glorious prairie spreading out beneath the golden beams of an autumnal sun. The deep and frequent traces of buffalo, showed it to be a one of their favorite grazing grounds.”<sup id=\"cite_ref-9\" class=\"reference\"><a href=\"#cite_note-9\">&#91;9&#93;</a></sup></p>"
          }
        }
      }

    const wikiService = jasmine.createSpyObj('WikiResultsService', ['search']);
    getWikiResponseSpy = wikiService.search.and.returnValue(of(MockWikiResponse));

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ WikiMediaComponent, { provide: WikiResultsService, useValue: wikiService } ],
      declarations: [ WikiMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when test with asynchronous observable', () => {
    beforeEach(() => {
      getWikiResponseSpy.and.returnValue(asyncData(testWikiResult));
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('displays location history', () => {
      component.getResults('Stillwater, Oklahoma');
      expect(component.body).toEqual(testWikiResult.parse.text["*"]);
    });

    it('displays correct location title', () => {
      component.getResults('Stillwater, Oklahoma');
      expect(component.wikiResult.parse.title).toEqual("Stillwater, Oklahoma");
    });
  });
});
