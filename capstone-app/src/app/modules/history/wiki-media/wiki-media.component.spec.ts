import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WikiMediaComponent } from './wiki-media.component';
import MockWikiServiceResponse from 'testing/mock-wiki-service-response.json';
import MockWikiServiceGermanResponse from 'testing/mock-wiki-service-german-response.json';
import { asyncData } from 'testing/async-observable-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { WikiResultsService } from '../wiki-results.service';
import { WikiSearchResult } from '../WikiSearchTemplate';
import { MatMenuModule } from '@angular/material/menu';
import { WikiServiceResult } from '../WikiServiceResult';

describe('WikiMediaComponent', () => {
  let component: WikiMediaComponent;
  let fixture: ComponentFixture<WikiMediaComponent>;
  let testWikiServiceResponse: WikiServiceResult;
  let testWikiGermanServiceResponse: WikiServiceResult;
  let getWikiResponseSpy: jasmine.Spy;
  let getWikiLangResponseSpy: jasmine.Spy;

  beforeEach(async(() => {
    testWikiServiceResponse = {
            title: 'Stillwater, Oklahoma',
            history: 'The north-central region of Oklahoma became part of the United States with the Louisiana '
              + 'Purchase in 1803. In 1832, author and traveler Washington Irving provided the first recorded '
              + 'description of the area around Stillwater in his book A Tour on the Prairies. He wrote of “a '
              + 'glorious prairie spreading out beneath the golden beams of an autumnal sun. The deep and frequent '
              + 'traces of buffalo, showed it to be a one of their favorite grazing grounds.”9',
           langlinks: new Map()
        }

        const englishLangLinks = new Map<string, Map<string, string>>();
        const enEs = new Map<string, string>();
        const enDe = new Map<string, string>();
        const enCa = new Map<string, string>();
        englishLangLinks.set('ca', enCa);
        englishLangLinks.set('de', enDe);
        englishLangLinks.set('es', enEs);
        testWikiServiceResponse.langlinks = englishLangLinks;

      testWikiGermanServiceResponse = {
            title: 'Stillwater, (Oklahoma)',
            history: 'The north-central region of Oklahoma became part of the United States with the Louisiana '
              + 'Purchase in 1803. In 1832, author and traveler Washington Irving provided the first recorded '
              + 'description of the area around Stillwater in his book A Tour on the Prairies. He wrote of “a '
              + 'glorious prairie spreading out beneath the golden beams of an autumnal sun. The deep and frequent '
              + 'traces of buffalo, showed it to be a one of their favorite grazing grounds.”9',
            langlinks: new Map()
        }

    const germanLangLinks = new Map<string, Map<string, string>>();
    const es = new Map<string, string>();
    const en = new Map<string, string>();
    const ca = new Map<string, string>();
    germanLangLinks.set('ca', ca);
    germanLangLinks.set('en', en);
    germanLangLinks.set('es', es);
    testWikiGermanServiceResponse.langlinks = germanLangLinks;

    const mockResponse: WikiServiceResult = {
      title: MockWikiServiceResponse.title,
      history: MockWikiServiceResponse.history,
      furtherReading: new Map(Object.entries(MockWikiServiceResponse.furtherReading)),
      langlinks: new Map(),
    };

    for (const lang in MockWikiServiceResponse.langlinks){
      const link = MockWikiServiceResponse.langlinks[lang];
      const links = new Map<string, string>();
      links.set('langName', link.langName);
      links.set('searchQuery', link.searchQuery);
      mockResponse.langlinks.set(lang, links);
    }

    const mockGermanResponse: WikiServiceResult = {
      title: MockWikiServiceGermanResponse.title,
      history: MockWikiServiceGermanResponse.history,
      furtherReading: new Map(Object.entries(MockWikiServiceGermanResponse.furtherReading)),
      langlinks: new Map(),
    };

    for (const lang in MockWikiServiceGermanResponse.langlinks){
      const link = MockWikiServiceGermanResponse.langlinks[lang];
      const links = new Map<string, string>();
      links.set('langName', link.langName);
      links.set('searchQuery', link.searchQuery);
      mockGermanResponse.langlinks.set(lang, links);
    }

    const wikiService = jasmine.createSpyObj('WikiResultsService', ['search', 'searchNewLang']);
    getWikiResponseSpy = wikiService.search.and.returnValue(of(mockResponse));
    getWikiLangResponseSpy = wikiService.searchNewLang.and.returnValue(of(mockGermanResponse));

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatMenuModule ],
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

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('displays location history', () => {
      component.getResults('Stillwater, Oklahoma');
      expect(component.history).toEqual(testWikiServiceResponse.history);
    });

    it('displays correct location title', () => {
      component.getResults('Stillwater, Oklahoma');
      expect(component.title).toEqual(testWikiServiceResponse.title);
    });

    it('returns map of langlinks that can be read', () => {
      component.getResults('Stillwater, Oklahoma');
      expect(component.langlinks).toEqual(testWikiServiceResponse.langlinks);
    });

    it('language change function is called on button selection', () => {
      spyOn(component, 'changeLanguage');
      component.onChangeLanguage('de');
      expect(component.changeLanguage).toHaveBeenCalledWith('Stillwater, (Oklahoma)', 'de', 'Geschichte');
    });

    it('history is changed correctly on changeLanguage call', () => {
      component.changeLanguage('Stillwater, (Oklahoma)', 'de', 'Geschichte');
      expect(component.history).toEqual(testWikiGermanServiceResponse.history);
    });

    it('title is changed correctly on changeLanguage call', () => {
      component.changeLanguage('Stillwater, (Oklahoma)', 'de', 'Geschichte');
      expect(component.title).toEqual(testWikiGermanServiceResponse.title);
    });

    it('langlinks are changed correctly on changeLanguage call', () => {
      component.changeLanguage('Stillwater, (Oklahoma)', 'de', 'Geschichte');
      expect(component.langlinks).toEqual(testWikiGermanServiceResponse.langlinks);
    });

  });
});
