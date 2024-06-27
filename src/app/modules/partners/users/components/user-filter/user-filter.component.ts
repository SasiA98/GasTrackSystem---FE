import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { UserFilter } from '@shared/models/user-filter.model';
import { Role } from '@shared/enums/role.enum';
import { ExtendedStatus } from '@shared/enums/extended-status.enum';
import { DropdownService } from '@shared/components/filter-dropdown/filter-dropdown.service';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss']
})
export class UserFilterComponent {
  Role = Role;
  roles = Role;
  ExtendedStatus = ExtendedStatus;
  form: FormGroup;

  @Input() userFilter: UserFilter = {} as UserFilter;
  @Output() userFilterChanged: EventEmitter<UserFilter> = new EventEmitter<UserFilter>();
  @Output() filtersApplied = new EventEmitter<any>();

  constructor(
    protected fb: FormBuilder,
    private readonly dropdownService: DropdownService
  ) {
    this.form = this.createForm(this.userFilter);
    this.resetForm();
    const filters = this.form.value;
    const activeFiltersCount = Object.keys(filters).filter(key => filters[key]).length;
    this.dropdownService.updateFiltersCount(activeFiltersCount);
    this.filtersApplied.emit(filters);
  }

  createForm(userFilter: UserFilter): FormGroup {
    return this.fb.group({
      status: this.fb.control(
        userFilter.status !== null ? userFilter.status : ExtendedStatus.ALL
      ),
      roles: this.fb.control(
        userFilter.roles && userFilter.roles.length > 0 ? userFilter.roles : null
      )
    });
  }

  apply(): void {
    this.dropdownService.closeDropdown();
    this.userFilter = this.form.value;
    this.userFilterChanged.emit(this.userFilter);
    const filters = this.form.value;
    const activeFiltersCount = Object.keys(filters).filter(key => filters[key]).length;
    this.dropdownService.updateFiltersCount(activeFiltersCount);
    this.filtersApplied.emit(filters);
  }

  resetForm(): void {
    this.form.patchValue({
      status: ExtendedStatus.ALL,
      roles: null
    });
    this.userFilter = this.form.value;;
  }

  eraseFilter(): void {
    this.resetForm();
    this.userFilterChanged.emit(this.userFilter);
    this.dropdownService.closeDropdown();
    const filters = this.form.value;
    const activeFiltersCount = Object.keys(filters).filter(key => filters[key]).length;
    this.dropdownService.updateFiltersCount(activeFiltersCount);
    this.filtersApplied.emit(filters);
  }
}
