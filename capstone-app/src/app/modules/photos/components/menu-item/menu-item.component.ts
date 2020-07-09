import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NavItem } from '../../nav-item';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  markerFilter: string;
  @Input() items: NavItem[];
  @Output() filterSelected = new EventEmitter<string>();
  @ViewChild('childMenu') public childMenu?: MatMenu;

  select(name: string) {
    this.filterSelected.emit(name);
  }


  updateFilterSelected(newFilter: string) {
    this.markerFilter = newFilter;
    this.select(this.markerFilter);
  }

}
