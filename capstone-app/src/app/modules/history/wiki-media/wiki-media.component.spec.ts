import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WikiMediaComponent } from './wiki-media.component';
import MockWikiServiceResponse from 'testing/mock-wiki-service-response.json';
import MockWikiServiceGermanResponse from 'testing/mock-wiki-service-german-response.json';
import { asyncData } from 'testing/async-observable-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedPlacesCityService } from 'src/app/services/shared-places-city.service';
import { of } from 'rxjs';
import { DebugElement, SimpleChange, SimpleChanges } from '@angular/core';
import { WikiResultsService } from '../wiki-results.service';
import { WikiSearchResult } from '../WikiSearchTemplate';
import { MatMenuModule } from '@angular/material/menu';
import { WikiServiceResult } from '../WikiServiceResult';

describe('WikiMediaComponent', () => {
  let component: WikiMediaComponent;
  let fixture: ComponentFixture<WikiMediaComponent>;
  let testWikiServiceResponse: WikiServiceResult;
  let testWikiGermanServiceResponse: WikiServiceResult;

  beforeEach(async(() => {
    testWikiServiceResponse = {
            title: 'Stillwater, Oklahoma',
            history: ['The north-central region of Oklahoma became part of the United States with the Louisiana '
              + 'Purchase in 1803. In 1832, author and traveler Washington Irving provided the first recorded '
              + 'description of the area around Stillwater in his book A Tour on the Prairies. He wrote of “a '
              + 'glorious prairie spreading out beneath the golden beams of an autumnal sun. The deep and frequent '
              + 'traces of buffalo, showed it to be a one of their favorite grazing grounds.”9'],
            langlinks: new Map()
        }

        const englishLangLinks = new Map<string, Map<string, string>>();
        const enDe = new Map<string, string>();
        enDe.set('searchQuery', 'Stillwater, (Oklahoma)');
        enDe.set('langName', 'German');
        enDe.set('url', 'https://de.wikipedia.org/wiki/Stillwater_(Oklahoma)');
        const enCa = new Map<string, string>();
        enCa.set('searchQuery', 'Stillwater (Oklahoma)');
        enCa.set('langName', 'Catalan');
        enCa.set('url', 'https://ca.wikipedia.org/wiki/Stillwater_(Oklahoma)');
        englishLangLinks.set('ca', enCa);
        englishLangLinks.set('de', enDe);
        testWikiServiceResponse.langlinks = englishLangLinks;

      testWikiGermanServiceResponse = {
            title: 'Stillwater, (Oklahoma)',
            history: ['Im Jahre 1879 war das Gebiet des heutigen Oklahoma noch unbesiedelt. Elias C. Boudinot, ein Abgeordneter der Arkansas Sezession, wollte dieses Land 1879 als „öffentliches Land“ deklarieren und es somit seinen Kunden der MKT – Railroad zur Verfügung zu stellen. Doch der amerikanische Präsident Rutherford B. Hayes wollte das Eindringen von Angloamerikanern in das geschützte Land verhindern und rief am 26. April 1879 eine Proklamation aus, die es untersagte dieses Land zu betreten, da es den Indianern gehöre. Doch es war bereits zu spät. Nur fünf Jahre später im Jahre 1884 konnte die Regierung dem Druck der Bevölkerung nicht mehr standhalten und das Amtsgericht in Topeka, Kansas urteilte, dass es ab sofort kein Verbrechen mehr sei, auf diesem Land zu siedeln. Am 12. Dezember 1884 wurde Stillwater als erste Siedlung gegründet. Nach dem ersten Land run (vgl. Oklahoma Land Run) am 22. April 1889 wurden auch weitere Gebiete von Angloamerikanern besiedelt.'],
            langlinks: new Map()
        }

    const germanLangLinks = new Map<string, Map<string, string>>();
    const es = new Map<string, string>();
    es.set('searchQuery', 'Stillwater (Oklahoma)');
    es.set('langName', 'Spanisch');
    es.set('url', 'https://es.wikipedia.org/wiki/Stillwater_(Oklahoma)');
    const en = new Map<string, string>();
    en.set('searchQuery', 'Stillwater, Oklahoma');
    en.set('langName', 'Englisch');
    en.set('url', 'https://en.wikipedia.org/wiki/Stillwater,_Oklahoma');
    const ca = new Map<string, string>();
    ca.set('searchQuery', 'Stillwater (Oklahoma)');
    ca.set('langName', 'Katalanisch');
    ca.set('url', 'https://ca.wikipedia.org/wiki/Stillwater_(Oklahoma)');
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
      links.set('searchQuery', link.searchQuery);
      links.set('langName', link.langName);
      links.set('url', link.url);
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
      links.set('searchQuery', link.searchQuery);
      links.set('langName', link.langName);
      links.set('url', link.url);
      mockGermanResponse.langlinks.set(lang, links);
    }

    const wikiService = jasmine.createSpyObj('WikiResultsService', ['search', 'searchNewLang']);
    wikiService.search.and.returnValue(of(mockResponse));
    wikiService.searchNewLang.and.returnValue(of(mockGermanResponse));
    const sharedCityService = new SharedPlacesCityService();

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatMenuModule ],
      providers: [{ provide: WikiResultsService, useValue: wikiService }, { provide: SharedPlacesCityService, useValue: sharedCityService }  ],
      declarations: [ WikiMediaComponent ]
    })
    .compileComponents();
    sharedCityService.setCityName('Stillwater, Oklahoma');
    fixture = TestBed.createComponent(WikiMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

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

    it('info changes with new city input', () => {
      spyOn(component, 'getResults');
      component.cityName = 'Stillwater, Oklahoma';
      const changes: SimpleChanges = {cityName: new SimpleChange('Stillwater, Oklahoma', 'Los Angeles, California', false)};
      component.cityName = 'Los Angeles, California';
      component.ngOnChanges(changes);
      expect(component.getResults).toHaveBeenCalledWith('Los Angeles, California');
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
