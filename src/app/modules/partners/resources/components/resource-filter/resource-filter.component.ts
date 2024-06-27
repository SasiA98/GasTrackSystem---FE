import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ExtendedUnitType } from '@shared/enums/extended-type.enum';
import { CurrentResourceStatus } from '@shared/enums/current-resource-status.enum';
import { Unit } from '@shared/models/unit.model';
import { UnitService } from '@shared/services/unit.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ResourceFilter } from '@shared/models/resource-filter.model';
import { DISABLED_FILTER } from '../resource-search/resource-search.component';
import { SkillGroup } from '@shared/models/skill-group.model';
import { Skill } from '@shared/models/skill.model';
import { SkillsService } from '@shared/services/skills.service';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { Observable, of, map, startWith } from 'rxjs';
import { DropdownService } from '@shared/components/filter-dropdown/filter-dropdown.service';

@Component({
  selector: 'app-resource-filter',
  templateUrl: './resource-filter.component.html',
  styleUrls: ['./resource-filter.component.scss']
})
export class ResourceFilterComponent implements OnInit {
  ExtendedUnitType = ExtendedUnitType;
  CurrentResourceStatus = CurrentResourceStatus;
  Units: Unit[] = [];
  filteredUnits: any[] = [];
  form: FormGroup = new FormGroup({});
  skillGroups: SkillGroup[] = [];
  skills: Skill[] = [];
  filteredSkills: Observable<Skill[]>[] = [];
  permissionsHourlyCosts: boolean = false;
  toggleValue: boolean = false;
  ageOp: boolean = false;
  seniorityOp: boolean = false;
  hourlyCostOp: boolean = false;
  isDisabled: boolean = false;
  checked: boolean = false;
  newValue: any;

  @Input() resourceFilter: ResourceFilter = {} as ResourceFilter;
  @Output() resourceFilterChanged: EventEmitter<ResourceFilter> =
    new EventEmitter<ResourceFilter>();
  @Output() filtersApplied = new EventEmitter<any>();

  constructor(
    protected fb: FormBuilder,
    private readonly unitService: UnitService,
    private readonly roleService: RolePermissionService,
    private readonly skillsService: SkillsService,
    private readonly dropDownService: DropdownService
  ) {
    this.getAllUnits();
    this.permissionsHourlyCosts = this.roleService.hasPermission(
      ROLE_VISIBILITY.RESOURCE_HOURLY_COSTS
    );
    this.resetForm();
    this.getAllSkills();
    this.updateActiveFiltersCount();
  }

  ngOnInit(): void {
    this.initializeSkillFilter(0); // Initialize the first skill group
  }

  get skillsArray(): FormArray {
    return this.form.get('skillsArray') as FormArray;
  }

  addSkillGroup(): void {
    const skillGroup = this.fb.group({
      skill: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });
    this.skillsArray.push(skillGroup);
    this.initializeSkillFilter(this.skillsArray.length - 1); // Initialize the newly added skill group
  }

  removeSkillGroup(index: number): void {
    this.skillsArray.removeAt(index);
    this.filteredSkills?.splice(index, 1); // Remove the corresponding filtered options
  }

  displayFn(skill: number): string {
    const s = this.skills.find((s) => s.id === skill);
    return s && s.name ? s.name : '';
  }

  private _filter(name: string): Skill[] {
    const filterValue = name.toLowerCase();
    return this.skills.filter((skill) => skill.name.toLowerCase().includes(filterValue));
  }

  private initializeSkillFilter(index: number): void {
    const skillsArray = this.form.get('skillsArray') as FormArray;

    if (!skillsArray) {
      return;
    }

    const skillControl = skillsArray.at(index)?.get('skill');

    if (!skillControl) {
      return;
    }

    // Ensure filteredSkills is initialized and has a valid length
    if (!this.filteredSkills) {
      this.filteredSkills = [];
    }

    this.filteredSkills[index] = skillControl.valueChanges.pipe(
      startWith<string | Skill>(''),
      map((value) => (typeof value === 'string' ? value : value?.name || '')),
      map((name) => (name ? this._filter(name) : this.skills.slice()))
    );
  }

  apply(): void {
    this.dropDownService.closeDropdown();
    this.resourceFilter = this.form.value;
    this.resourceFilterChanged.emit(this.resourceFilter);
    this.updateActiveFiltersCount();
  }

  resetForm(): void {
    this.resourceFilter = this.initializeResourceFilter();
    this.form = this.createForm(this.resourceFilter);
    this.skillsArray.clear();
    this.addSkillGroup(); // Add a skill group on reset
    this.updateActiveFiltersCount();
  }

  eraseFilter(): void {
    this.resetForm();
    this.resourceFilterChanged.emit(this.resourceFilter);
  }

  private initializeResourceFilter(): ResourceFilter {
    return {
      age: DISABLED_FILTER,
      ageOp: false,
      seniority: DISABLED_FILTER,
      seniorityOp: false,
      unitType: ExtendedUnitType.ALL,
      unit: 0,
      hourlyCost: DISABLED_FILTER,
      hourlyCostOp: false,
      resourceStatus: CurrentResourceStatus.ACTIVE,
      skillsArray: []
    };
  }

  createForm(resourceFilter: ResourceFilter): FormGroup {
    return this.fb.group({
      unit: this.fb.control(resourceFilter.unit !== -1 ? resourceFilter.unit : null),
      unitType: this.fb.control(resourceFilter.unitType),
      resourceStatus: this.fb.control(resourceFilter.resourceStatus),
      seniority: this.fb.control(
        resourceFilter.seniority !== -1 ? resourceFilter.seniority : null
      ),
      age: this.fb.control(resourceFilter.age !== -1 ? resourceFilter.age : null),
      hourlyCost: this.fb.control(
        resourceFilter.hourlyCost !== -1 ? resourceFilter.hourlyCost : null
      ),
      hourlyCostOp: this.fb.control(resourceFilter.hourlyCostOp),
      ageOp: this.fb.control(resourceFilter.ageOp),
      seniorityOp: this.fb.control(resourceFilter.seniorityOp),
      skillsArray: this.fb.array(
        resourceFilter?.skillsArray?.map((skill) =>
          this.fb.group({
            skill: this.fb.control(skill.skill),
            rating: this.fb.control(skill.rating)
          })
        ) || []
      )
    });
  }
  

  seniorityOpToggleOnChange() {
    this.seniorityOp = !this.seniorityOp;
    return this.seniorityOp;
  }

  ageOpToggleOnChange() {
    this.ageOp = !this.ageOp;
    return this.ageOp;
  }

  hourlyCostOpToggleOnChange() {
    this.hourlyCostOp = !this.hourlyCostOp;
    return this.hourlyCostOp;
  }

  private getAllSkills(): void {
    this.skillsService.getAllSkills().subscribe((skill) => {
      this.skills = skill;
      this.resetForm();
    });
  }

  private getAllUnits(): void {
    this.unitService.getAll().subscribe((unit) => {
      this.Units = unit;
      this.filteredUnits = unit;
    });
  }

  onUnitTypeChange(selectedUnitType: any) {
    if (selectedUnitType == ExtendedUnitType.ALL) {
      this.getAllUnits();
    } else {
      this.filteredUnits = this.Units.filter((unit) => unit.type === selectedUnitType);
    }
    if (
      this.form.get('unitType')?.value == ExtendedUnitType.ALL ||
      this.form.get('unitType')?.value == ExtendedUnitType.BUSINESS ||
      this.form.get('unitType')?.value == ExtendedUnitType.DELIVERY
    ) {
      this.form.get('unit')?.setValue(0);
    }
  }

  private updateActiveFiltersCount() {
    const { hourlyCostOp, ageOp, seniorityOp, ...filters } = this.form.value;
    const activeFiltersCount = Object.keys(filters).filter((key) => filters[key]).length;
    if (this.form.get('unit')?.value == 0) {
      this.dropDownService.updateFiltersCount(activeFiltersCount + 1);
    } else {
      this.dropDownService.updateFiltersCount(activeFiltersCount);
    }
    this.filtersApplied.emit(filters);
  }
}
