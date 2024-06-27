import { Component } from '@angular/core';
import { DropdownService } from './filter-dropdown.service';

@Component({
    selector: 'app-filter-dropdown',
    templateUrl: './filter-dropdown.component.html',
    styleUrls: ['./filter-dropdown.component.scss']
})

export class DropdownButtonComponent {
  isDropdownOpen = false;
  filtersCount = 0;

  constructor(private dropdownService: DropdownService) {
    this.dropdownService.dropdownOpen$.subscribe(isOpen => {
      this.isDropdownOpen = isOpen;
    });

    this.dropdownService.filtersCount$.subscribe(count => {
      this.filtersCount = count;
    });
  }

  toggleDropdown(): void {
    this.dropdownService.toggleDropdown();
  }
}
