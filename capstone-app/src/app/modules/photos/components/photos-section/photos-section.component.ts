import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavItem } from '../../nav-item';

@Component({
  selector: 'app-photos-section',
  templateUrl: './photos-section.component.html',
  styleUrls: ['./photos-section.component.scss'],
})
export class PhotosSectionComponent implements OnInit, OnChanges {
  @Input() city: string;
  @Input() markerPlaces: Map<string, string[]>;
  @Input() activeMarker: string;
  @Output() activeMarkerUpdate = new EventEmitter<string>();
  previousCity: string;
  limitControl = new FormControl(10, [Validators.min(1), Validators.max(10)]);
  maxPhotos = 10;
  mockPlaces = new Map<string, string[]>();
  /**
   * These variables are meant to detect the categories markers belong to.
   * uniqueTypes: Some markers belong to more than one category.
   * allTypes: The types before extracting the unique ones
   */
  uniqueTypes: string[];
  allTypes: string[] = [];
  navItems: NavItem[] = [];
  markerFilter = '';

  ngOnInit() {
    this.mockPlaces.set('Pjs Wings', ['Restuarant']);
    this.mockPlaces.set('Colonial Theater', ['History', 'Entertainment']);
    this.mockPlaces.set('Valley Forge', ['History', 'Landmark']);
  }

  // Until the photos section is connected to the maps, only mocks are supported
  ngOnChanges(changes: SimpleChanges) {
    if (changes.city && this.city === '') {
      this.city = this.previousCity;
    }
    else if (changes.activeMarker) {
      this.markerFilter = this.activeMarker;
    }
    else {
      this.previousCity = this.city;
    }

    this.extractUniqueTypes();
    this.populateNavItems();
  }

  /**
   * Organzies marker input data into object compatible with menu.
   */
  populateNavItems() {
    this.navItems = [];
    const tempItem: NavItem[] = [];
    tempItem.push({ name: this.city });
    let menuTypes: NavItem[] = [];
    let tempType: string;
    for (const type of this.uniqueTypes) {
      menuTypes = [];
      for (const [key, value] of this.markerPlaces) {
        if (value.includes(type)) {
          menuTypes.push({ name: key });
        }
      }
      tempType = type
        .split('_')
        .join(' ')
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

      tempItem.push({ name: tempType, children: menuTypes });
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
    } else if (wasRemoved === 1 && this.limitControl.value >= newLimit) {
      this.maxPhotos = newLimit;
      this.limitControl = new FormControl(newLimit);
    } else {
      this.maxPhotos = newLimit;
    }
  }

  updateFilterSelected(newFilter: string) {
    this.activeMarkerUpdate.emit(newFilter);
    if (newFilter !== this.city) {
      this.markerFilter = newFilter;
    } else {
      this.markerFilter = '';
    }
  }

  extractUniqueTypes() {
    this.allTypes = [];
    const tempTypes: string[][] = [];
    for (const [key, value] of this.markerPlaces) {
      tempTypes.push(value);
    }
    this.allTypes = tempTypes.flat();
    const copyForSplicing = this.allTypes.slice();
    this.uniqueTypes = this.allTypes.filter((category) => {
      copyForSplicing.splice(copyForSplicing.indexOf(category), 1);
      return !copyForSplicing.includes(category);
    });
  }
}
