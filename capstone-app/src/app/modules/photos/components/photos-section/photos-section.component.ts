import {
  Component,
  Input,
  OnChanges,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import MockPlacesPa from 'src/app/modules/photos/assets/mock-places-phoenixville.json';
import MockPlacesBos from 'src/app/modules/photos/assets/mock-places-boston.json';
import { NavItem } from '../../nav-item';

@Component({
  selector: 'app-photos-section',
  templateUrl: './photos-section.component.html',
  styleUrls: ['./photos-section.component.scss'],
})
export class PhotosSectionComponent implements OnChanges, AfterViewChecked {
  limitControl = new FormControl(10, [Validators.min(1), Validators.max(10)]);
  maxPhotos = 10;
  mockPlacesPa: any = (MockPlacesPa as any).places;
  mockPlacesBos: any = (MockPlacesBos as any).places;
  mockPlaces: any;
  /**
   * These variables are meant to detect the categories markers belong to.
   * uniqueTypes: Some markers belong to more than one category.
   * allTypes: The types before extracting the unique ones
   */
  uniqueTypes: string[];
  allTypes: string[];
  navItems: NavItem[] = [];
  markerFilter = '';
  @Input() city: string;

  constructor(private cdr: ChangeDetectorRef) {}

  // Until the photos section is connected to the maps, only mocks are supported
  ngOnChanges() {
    if (this.city.includes('Boston')) {
      this.mockPlaces = this.mockPlacesBos;
    } else {
      this.mockPlaces = this.mockPlacesPa;
    }
    this.extractUniqueTypes();
    this.populateNavItems();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  /**
   * Organzies marker input data into object compatible with menu.
   */
  populateNavItems() {
    this.navItems = [];
    const tempItem: NavItem[] = [];
    tempItem.push({ name: this.city });
    let menuTypes: NavItem[] = [];
    for (const type of this.uniqueTypes) {
      menuTypes = [];
      for (const place of this.mockPlaces) {
        if (place.types.includes(type)) {
          menuTypes.push({ name: place.name });
        }
      }
      tempItem.push({ name: type, children: menuTypes });
    }
    this.navItems.push({ name: 'Tourist Attraction', children: tempItem });
  }

  /**
   * Creating a new form control sets the current value of the form to the value input
   * We only want the current value of the form to change in two scenarios:
   * 1) The current value is maxed out and the new limit is more than the max
   * ( This means ther user wants to display as many images as allowed )
   * 2) There are bad photos which cannot be fetched so the new limit is less than max
   */
  updateLimit(newLimit: number, wasRemoved: number) {
    if (this.limitControl.value === this.maxPhotos && this.maxPhotos < newLimit) {
      this.maxPhotos = newLimit;
      this.limitControl = new FormControl(newLimit);
    }
    else if (wasRemoved === 1 && this.limitControl.value >= newLimit) {
      this.maxPhotos = newLimit;
      this.limitControl = new FormControl(newLimit);
    }
    else {
      this.maxPhotos = newLimit;
    }
  }

  updateFilterSelected(newFilter: string) {
    if (newFilter !== this.city) {
      this.markerFilter = newFilter;
    } else {
      this.markerFilter = '';
    }
  }

  extractUniqueTypes() {
    this.allTypes = Object.keys(this.mockPlaces)
      .map((key) => this.mockPlaces[key].types)
      .flat();
    const copyForSplicing = this.allTypes.slice();
    this.uniqueTypes = this.allTypes = this.allTypes.filter((category) => {
      copyForSplicing.splice(copyForSplicing.indexOf(category), 1);
      return !copyForSplicing.includes(category);
    });
  }
}
