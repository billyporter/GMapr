import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NavItem } from '../../nav-item';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() items: NavItem[];
  @Output() filterSelected = new EventEmitter<string>();
  @ViewChild('childMenu') public childMenu?: MatMenu;
  markerFilter: string;
  optionsTypes = new Map<string, string>([
    ['Airport', 'local_airport'],
    ['Bar', 'local_bar'],
    ['Church', 'add'], ['City Hall', 'home_work'],
    ['Lodging', 'hotel'],
    ['Food', 'fastfood'],
    ['Book Store', 'local_library'],
    ['Library', 'local_library'],
    ['Casino', 'casino'],
    ['Courthouse', 'lock'],
    ['Bowling Alley', 'sports_kabaddi'],
    ['Electronics Store', 'electrical_services'],
    ['Home Goods Store', 'storefront'],
    ['Local Government Office', 'account_balance'],
    ['Parking', 'local_parking'],
    ['Art Gallery', 'art_track'],
    ['Place Of Worship', 'wc'],
    ['Liquor Store', 'sports_bar'],
    ['Finance', 'attach_money'],
    ['Nature Feature', 'nature'],
    ['Amusement Park', 'star'],
    ['Zoo', 'streetview'],
    ['Travel Agency', 'card_travel'],
    ['Mosque', 'group'],
    ['Shopping Mall', 'shopping_basket'],
    ['Cafe', 'local_cafe'],
    ['Stadium', 'sports_handball'],
    ['Grocery Or Supermarket', 'local_grocery_store'],
    ['Aquarium', 'panorama_fish_eye'],
    ['Museum', 'museum'], ['Park', 'nature_people'], ['Police', 'local_police'],
    ['Restaurant', 'restaurant'], ['Store', 'store'],
    ['Tourist Attraction', 'public'], ['University', 'school']
  ]);

  select(name: string) {
    this.filterSelected.emit(name);
  }

  updateFilterSelected(newFilter: string) {
    this.markerFilter = newFilter;
    this.select(this.markerFilter);
  }

}
