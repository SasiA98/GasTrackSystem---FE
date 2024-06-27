import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Observable, map, mergeMap, of, startWith } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Resource } from '@shared/models/resource.model';
import { ResourceService } from '@shared/services/resource.service';
import { ProjectFilter } from '@shared/models/project-filter.model';
import { Role } from '@shared/enums/role.enum';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { ProjectStatus } from '@shared/enums/project-status.enum';
import { DropdownService } from '@shared/components/filter-dropdown/filter-dropdown.service';

@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss']
})
export class ProjectFilterComponent {
  resources_pm: Resource[] = [];
  resources_dum: Resource[] = [];
  resources_presale: Resource[] = [];
  form: FormGroup;
  ProjectStatus = [
    ProjectStatus.PRE_SALE,
    ProjectStatus.TO_START,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.CLOSED,
    ProjectStatus.LOST,
    ProjectStatus.CANCELLED,
  ];

  dumCtrl = new FormControl();
  presaleCtrl = new FormControl();
  pmCtrl = new FormControl();
  resourcesDumOb: Observable<Resource[]> = of([]);
  resourcesPreSaleOb: Observable<Resource[]> = of([]);
  resourcesPMOb: Observable<Resource[]> = of([]);

  StatusProject = ProjectStatus;

  @Input() projectFilter: ProjectFilter = {} as ProjectFilter;
  @Output() projectFilterChanged: EventEmitter<ProjectFilter> = new EventEmitter<ProjectFilter>();
  @Output() filtersApplied = new EventEmitter<any>();

  constructor(
    protected fb: FormBuilder,
    private readonly resourceService: ResourceService,
    private readonly dropdownService: DropdownService,
    private readonly roleService: RolePermissionService
  ) {
    this.getAllResources();
    this.form = this.createForm(this.projectFilter);
    const filters = this.form.value;
    const activeFiltersCount = Object.keys(filters).filter(key => filters[key]).length;
    this.dropdownService.updateFiltersCount(activeFiltersCount);
    this.filtersApplied.emit(filters);
  }

  initializeResourcesDUMOb() : void {
    this.resourcesDumOb = this.dumCtrl.valueChanges.pipe(
      startWith(''),
      map((value: string|Resource) => {
        if (typeof value === 'string') {
          return this.filterOptionsByLabel(this.resources_dum, value);
        }
        return this.resources_dum;
      }));
  }

  initializeResourcesPreSaleOb() : void {
    this.resourcesPreSaleOb = this.presaleCtrl.valueChanges.pipe(
      startWith(''),
      map((value: string|Resource) => {
        if (typeof value === 'string') {
          return this.filterOptionsByLabel(this.resources_presale, value);
        }
        return this.resources_presale;
      }));
  }

  initializeResourcesPMOb() : void {
    this.resourcesPMOb = this.pmCtrl.valueChanges.pipe(
      startWith(''),
      map((value: string|Resource) => {
        if (typeof value === 'string') {
          return this.filterOptionsByLabel(this.resources_pm, value);
        }
        return this.resources_pm;
      }));
  }

  filterOptionsByLabel(options: Resource[], label: string): Resource[] {
    const value = label.trim().toLowerCase();
    return options.filter((option: Resource) => {
      const fullName = `${option.name.toLowerCase()} ${option.surname.toLowerCase()}`;
      return fullName.includes(value);
    });
  }

  displayLabelFn(r: Resource|null) {
    return r ? `${r.name} ${r.surname}` : '';
  }

  trackByIdFn(r: Resource) {
    return r.id;
  }

  hasPermissions(): boolean {
    var roles = this.roleService.getUserRole();
    return !roles.every((role) => role === Role.PM || role === Role.CONSULTANT);
  }

  getAllResources(): void {
    this.resourceService
      .getAll()
      .pipe(
        mergeMap((resources) => {
          const resources_pm = resources.filter((r) => r.roles.includes(Role.PM));
          const resources_dum = resources.filter((r) => r.roles.includes(Role.DUM));
          const resources_presale = resources.filter((r) => {
            for (let role of [Role.PSE, Role.PSM, Role.PSL]) {
              if (r.roles.includes(role)) {
                return true;
              }
            }
            return false;
          });

          return of({
            resources_pm,
            resources_dum,
            resources_presale
          });
        })
      )
      .subscribe((resources) => {
        const { resources_pm, resources_dum, resources_presale } = resources;
        this.resources_pm = resources_pm;
        this.resources_dum = resources_dum;
        this.resources_presale = resources_presale;
        this.initializeResourcesDUMOb();
        this.initializeResourcesPreSaleOb();
        this.initializeResourcesPMOb();
      });
  }

  createForm(projectFilter: ProjectFilter): FormGroup {
    return this.fb.group({
      industry: this.fb.control(
        projectFilter.industry !== '' ? projectFilter.industry : null
      ),
      PRESALE_id: this.fb.control(
        projectFilter.PRESALE_id !== -1 ? projectFilter.PRESALE_id : null
      ),
      DUM_id: this.fb.control(projectFilter.DUM_id !== -1 ? projectFilter.DUM_id : null),
      bmTrigram: this.fb.control(
        projectFilter.bmTrigram !== '' ? projectFilter.bmTrigram : null
      ),
      PM_id: this.fb.control(projectFilter.PM_id !== -1 ? projectFilter.PM_id : null),
      status: this.fb.control(projectFilter.status !== '' ? projectFilter.status : null)
    });
  }

  apply(): void {
    this.dropdownService.closeDropdown();
    this.projectFilter = this.form.value;
    this.projectFilter.DUM_id = this.dumCtrl.value ? this.dumCtrl.value.id : null;
    this.projectFilter.PRESALE_id = this.presaleCtrl.value ? this.presaleCtrl.value.id : null;
    this.projectFilter.PM_id = this.pmCtrl.value ? this.pmCtrl.value.id : null;
    this.projectFilterChanged.emit(this.projectFilter);
    const filters = this.form.value;
    const activeFiltersCount = Object.keys(filters).filter(key => filters[key]).length;
    this.dropdownService.updateFiltersCount(activeFiltersCount);
    this.filtersApplied.emit(filters);

  }

  eraseFilter(): void {
    this.form.reset();
    this.projectFilter = this.form.value;
    this.dumCtrl.setValue(null);
    this.presaleCtrl.setValue(null);
    this.pmCtrl.setValue(null);
    this.projectFilterChanged.emit(this.projectFilter);
    const filters = this.form.value;
    const activeFiltersCount = Object.keys(filters).filter(key => filters[key]).length;
    this.dropdownService.updateFiltersCount(activeFiltersCount);
    this.filtersApplied.emit(filters);
    this.dropdownService.closeDropdown();
  }
}
