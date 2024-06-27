import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Column } from '@shared/components/generic-table/models/column.model';
import { Role } from '@shared/enums/role.enum';
import { Resource } from '@shared/models/resource.model';
import { PageResponse } from '@shared/models/page-response.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subscription, map } from 'rxjs';
import { ExtendedUnitType } from '@shared/enums/extended-type.enum';
import { AdvancedSearchBasePageComponent } from 'src/app/base/base-page/advanced-search-base-page.component';
import { AdvancedSearchCriteria } from 'src/app/base/models/advanced-search/advanced-search-criteria.model';
import { AdvancedSearchOperator } from 'src/app/base/models/advanced-search/advanced-search-operator.enum';
import { AdvancedSearchSimpleCriteria } from 'src/app/base/models/advanced-search/advanced-search-simple-criteria.model';
import { PagingAndSortingCriteria } from 'src/app/base/models/paging-and-sorting-criteria.model';
import { EmptyObject } from 'src/app/base/types/empty-object.type';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { ResourceService } from '@shared/services/resource.service';
import { CurrentResourceStatus } from '@shared/enums/current-resource-status.enum';
import { ResourceTableColumns } from '../../constants/resource-table-columns.constant';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { ResourceFilter } from '@shared/models/resource-filter.model';

export const DISABLED_FILTER = null;


@Component({
  selector: 'app-resource-search',
  templateUrl: './resource-search.component.html',
  styleUrls: ['./resource-search.component.scss']
})

export class ResourceSearchComponent extends AdvancedSearchBasePageComponent<PageResponse<Resource>> {
  content: string = RoutesEnum.RESOURCES;
  ROLE_VISIBILITY = ROLE_VISIBILITY;
  Role = Role;
  columns: Column[] = ResourceTableColumns.filter(col =>
    col.attributeName !== 'lastHourlyCost'
  );
  resourceFilter : ResourceFilter;
  form = new FormGroup({
    fullName: new FormControl('')
  });
  userRole: string[] = [];
  private searchSubscription!: Subscription;
  private searchTimer: any;
  private searchDelay = 300;

  constructor(
    injector: Injector,
    ngxUiLoaderService: NgxUiLoaderService,
    private readonly resourceService: ResourceService,
    public readonly roleService: RolePermissionService,
    private readonly router: Router,
  ) {

    super(injector, ngxUiLoaderService);
    this.visibleColumns();
    this.resourceFilter =  this.initializeResourceFilter();
    this.startSearchOnInit = true;
    this.searchSubscription = this.form.get('fullName')!.valueChanges.subscribe(() => {
      this.startInterval();
    });
  }

  private visibleColumns(): void {
    this.userRole = this.roleService.getUserRole();
    if (this.userRole.includes(Role.ADMIN) || this.userRole.includes(Role.GDM) || this.userRole.includes(Role.DUM))
      this.columns = ResourceTableColumns;
  }

  private initializeResourceFilter(): ResourceFilter {
    return {
        age: DISABLED_FILTER,
        ageOp: false,
        seniority: DISABLED_FILTER,
        seniorityOp: false,
        unitType: ExtendedUnitType.DELIVERY,
        unit: 0,
        hourlyCost: DISABLED_FILTER,
        hourlyCostOp: false,
        resourceStatus: CurrentResourceStatus.ACTIVE,
        skillsArray: [],
    };
  }

  onResourceFilterChanged(filter: ResourceFilter): void {
    this.resourceFilter = filter;
    this.onSubmit();
  }

  override ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.clearInterval();
  }

  startInterval() {
    this.clearInterval(); // Cancella il timer precedente se esiste
    this.searchTimer = setTimeout(() => {
      this.onSubmit();
    }, this.searchDelay);
  }

  clearInterval() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
  }


  protected search(
    criteria?: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria,
    sortCriteria?: PagingAndSortingCriteria
  ): Observable<PageResponse<Resource>> {
    return this.resourceService.advancedSearch(criteria, sortCriteria);
  }

  protected defineSearchCriteria():
    | AdvancedSearchCriteria
    | AdvancedSearchSimpleCriteria
    | EmptyObject {

    const fullName = this.form.get('fullName')?.value || "";
    const unit = this.resourceFilter?.unit ?? 0;
    const unitType = this.resourceFilter?.unitType ?? null;
    const seniority = this.resourceFilter?.seniority ?? null;
    const seniorityOp = this.resourceFilter?.seniorityOp ?? false;
    const age = this.resourceFilter?.age ?? null;
    const ageOp = this.resourceFilter?.ageOp ?? false;
    const hourlyCost = this.resourceFilter?.hourlyCost ?? null;
    const hourlyCostOp = this.resourceFilter?.hourlyCostOp ?? false;
    const resourceStatus = this.resourceFilter?.resourceStatus ?? CurrentResourceStatus.ACTIVE;
    const skillsArray = this.resourceFilter?.skillsArray ?? [];

    const criteriaArray: (AdvancedSearchCriteria | AdvancedSearchSimpleCriteria)[] = [];

    const fullNameOperand = this.getFullNameOperand(fullName);

    criteriaArray.push(fullNameOperand);


    if (unitType !== ExtendedUnitType.ALL){
      const unitTypeOperand = this.getUnitTypeOperand(unitType);
      criteriaArray.push(unitTypeOperand);
    }

    if (resourceStatus !== CurrentResourceStatus.ALL){
      const resourceStatusOperand = this.getResourceStatusOperand(resourceStatus);
      criteriaArray.push(resourceStatusOperand);
    }

    if (seniority !== DISABLED_FILTER){
      const seniorityOperand = this.getSeniorityOperand(seniority, seniorityOp);
      criteriaArray.push(seniorityOperand);
    }

    if (age !== DISABLED_FILTER){
      const ageOperand = this.getAgeOperand(age, ageOp);
      criteriaArray.push(ageOperand);
    }

    if (unit != 0){
      const unitOperand = this.getUnitOperand(unit);
      criteriaArray.push(unitOperand);
    }
    if (skillsArray.length > 0 && skillsArray[0].skill !== "" &&  skillsArray[0].rating !== "" ) {
      skillsArray.forEach(s => {
        const skill = s.skill;
        const rating = s.rating;
    
        // Verifica se sia lo skill che il rating sono diversi da DISABLED_FILTER
        if (skill !== DISABLED_FILTER && rating !== DISABLED_FILTER) {
          // Aggiungi l'operando di rating al criterio di ricerca
          const ratingOperand = this.getRatingOperand(skill, rating);
          criteriaArray.push(ratingOperand);
        }
      });
    }
    

    if (hourlyCost !== DISABLED_FILTER){
      const hourlyCostOperand = this.getHourlyCostOperand(hourlyCost, hourlyCostOp);
      criteriaArray.push(hourlyCostOperand);
    }

    const result: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria = this.createAndComplexCriteria(criteriaArray);

    return result;
  }

  private getHourlyCostOperand(hourlyCost: number, hourlyCostOp: boolean): AdvancedSearchCriteria | AdvancedSearchSimpleCriteria {
      let op: AdvancedSearchOperator;
      const currentDate = new Date();

      if (hourlyCostOp == false) { // false is equal to LTE - true is equal to GTE
          op = AdvancedSearchOperator.HOURLY_COST_IS_LTE;
      } else if (hourlyCostOp == true) {
        op = AdvancedSearchOperator.HOURLY_COST_IS_GTE;
      } else {
          throw new Error('Invalid ageOp value. It must be "true" or "false".');
      }

      return {
           field: 'currentHourlyCost',
           value: hourlyCost,
           operator: op
      };
  }

  private getUnitTypeOperand(unitType: String): AdvancedSearchSimpleCriteria {
    return {
         field: 'unit.type',
         value: unitType,
         operator: AdvancedSearchOperator.EQUALS
       };
  }

  private getResourceStatusOperand(resourceStatus: String): AdvancedSearchCriteria | AdvancedSearchSimpleCriteria  {
    let currentDate = new Date();

    if (resourceStatus === CurrentResourceStatus.ACTIVE){
      return {
         operandOne: {
           field: 'leaveDate',
           value: currentDate,
           operator: AdvancedSearchOperator.IS_DATE_GTE
         },
         operandTwo: {
           field: 'leaveDate',
           value: null,
           operator: AdvancedSearchOperator.IS_NULL
         },
         operator: 'OR',
      };
    } else if (resourceStatus === CurrentResourceStatus.LEFT){
      return {
           field: 'leaveDate',
           value: currentDate,
           operator: AdvancedSearchOperator.IS_DATE_LTE
         };
    } else {
        throw new Error('Invalid resourceStatus value. It must be "ACTIVE" or "LEFT".');
    }
  }

  private getUnitOperand(unit: number): AdvancedSearchSimpleCriteria {
      return {
           field: 'unit.id',
           value: unit,
           operator: AdvancedSearchOperator.EQUALS
         };
  }

  private getFullNameOperand(fullName: String): AdvancedSearchCriteria {
    return {
      operandOne: {
        field: 'name',
        value: fullName,
        operator: AdvancedSearchOperator.IS_LIKE
      },
      operandTwo: {
        field: 'surname',
        value: fullName,
        operator: AdvancedSearchOperator.IS_LIKE
      },
      operator: 'OR',
     };
  }

  private getSeniorityOperand(seniority: number, seniorityOp: boolean): AdvancedSearchCriteria | AdvancedSearchSimpleCriteria {
      let op: AdvancedSearchOperator;
      let currentDate = new Date();
      let adjustedDate = new Date(currentDate.getFullYear() - seniority, currentDate.getMonth(), currentDate.getDate());
      let formattedDate;

      if (seniorityOp == false) { // false is equal to LTE - true is equal to GTE
          adjustedDate.setMonth(adjustedDate.getMonth() - 6);
          op = AdvancedSearchOperator.IS_DATE_GTE; // GTE seniorityOp turns in LTE for AdvancedSearchOperator
      } else if (seniorityOp == true) {
        adjustedDate.setMonth(adjustedDate.getMonth() + 6);
        op = AdvancedSearchOperator.IS_DATE_LTE; // LTE seniorityOp turns in GTE for AdvancedSearchOperator
      } else {
          throw new Error('Invalid ageOp value. It must be "true" or "false".');
      }

      return {
           field: 'hiringDate',
           value: adjustedDate,
           operator: op
      };
  }

  private getAgeOperand(age: number, ageOp: boolean): AdvancedSearchCriteria | AdvancedSearchSimpleCriteria {
      let op: AdvancedSearchOperator;
      let currentDate = new Date();
      let adjustedDate = new Date(currentDate.getFullYear() - age, currentDate.getMonth(), currentDate.getDate());
      let formattedDate;

      if (ageOp == false) {  // false is equal to LTE - true is equal to GTE
          adjustedDate.setMonth(adjustedDate.getMonth() - 6);
          op = AdvancedSearchOperator.IS_DATE_GTE; // GTE ageOp turns in LTE for AdvancedSearchOperator
      } else if (ageOp == true) {
        adjustedDate.setMonth(adjustedDate.getMonth() + 6);
        op = AdvancedSearchOperator.IS_DATE_LTE;
      } else {
          throw new Error('Invalid ageOp value. It must be "true" or "false".');
      }

      return {
           field: 'birthDate',
           value: adjustedDate,
           operator: op
      };
  }


  private getRatingOperand(skillId?: number | string, rating?: number | string): AdvancedSearchSimpleCriteria {
    return {
         field: 'resourceSkills.rating',
         value: skillId + "-" + rating,
         operator: AdvancedSearchOperator.SKILL_RATING_IS_GTE
       };
  }


  protected defineSortCriteria(): string | { [key: string]: 'asc' | 'desc' } {
    return { name: 'asc' };
  }

  onNewClick(): void {
    //this.resourceService.enablePrivateFieldEditable();
    this.router.navigate([RoutesEnum.NEW], { relativeTo: this.activatedRoute });
  }

  onEditClick(resource: Resource): void {
    //this.resourceService.disablePrivateFieldEditable();
    this.router.navigate([resource.id], {
      relativeTo: this.activatedRoute
    });
  }

  onFilterClick(): void {
    this.router.navigate([RoutesEnum.FILTER], { relativeTo: this.activatedRoute });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
  }

  onSortChange(sort: { field: string; direction: 'asc' | 'desc' | '' }) {
    this.changeSort(sort.field, sort.direction || 'asc');
  }
}
