import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  private dropdownOpenSubject = new BehaviorSubject<boolean>(false);
  dropdownOpen$ = this.dropdownOpenSubject.asObservable();

  private filtersCountSubject = new BehaviorSubject<number>(0);
  filtersCount$ = this.filtersCountSubject.asObservable();

  toggleDropdown(): void {
    this.dropdownOpenSubject.next(!this.dropdownOpenSubject.value);
  }

  closeDropdown(): void {
    this.dropdownOpenSubject.next(false);
  }

  updateFiltersCount(count: number): void {
    this.filtersCountSubject.next(count);
  }
}
