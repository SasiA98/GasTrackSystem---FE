import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Column } from '@shared/components/generic-table/models/column.model';
import { Role } from '@shared/enums/role.enum';
import { Unit } from '@shared/models/unit.model';
import { PageResponse } from '@shared/models/page-response.model';
import { UnitService } from '@shared/services/unit.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subscription } from 'rxjs';
import { AdvancedSearchBasePageComponent } from 'src/app/base/base-page/advanced-search-base-page.component';
import { AdvancedSearchCriteria } from 'src/app/base/models/advanced-search/advanced-search-criteria.model';
import { AdvancedSearchOperator } from 'src/app/base/models/advanced-search/advanced-search-operator.enum';
import { AdvancedSearchSimpleCriteria } from 'src/app/base/models/advanced-search/advanced-search-simple-criteria.model';
import { PagingAndSortingCriteria } from 'src/app/base/models/paging-and-sorting-criteria.model';
import { EmptyObject } from 'src/app/base/types/empty-object.type';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { UnitTableColumns } from '../../constants/unit-table-columns.constant';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';

import { ExtendedUnitType } from '@shared/enums/extended-type.enum';
import { ExtendedStatus } from '@shared/enums/extended-status.enum';


@Component({
  selector: 'app-unit-search',
  templateUrl: './unit-search.component.html',
  styleUrls: ['./unit-search.component.scss']
})
export class UnitSearchComponent extends AdvancedSearchBasePageComponent<PageResponse<Unit>> {

  ExtendedUnitType = ExtendedUnitType;
  ExtendedStatus = ExtendedStatus;

  opUnitType: any;
  opStatus: any;

  content: string = RoutesEnum.UNITS;
  Role = Role;
  ROLE_VISIBILITY = ROLE_VISIBILITY;
  columns: Column[] = UnitTableColumns;
  form = new FormGroup({
    searchInput: new FormControl(''),
    unit: new FormControl({value: 'All', disabled: false}),
    status: new FormControl({value: 'All', disabled: false})
  });

  private searchSubscription!: Subscription;
  private searchTimer: any;
  private searchDelay = 300;

  constructor(
    injector: Injector,
    ngxUiLoaderService: NgxUiLoaderService,
    private readonly unitService: UnitService,
    public readonly roleService: RolePermissionService,
    private readonly router: Router
  ) {
    super(injector, ngxUiLoaderService);
    this.startSearchOnInit = true;
    this.searchSubscription = this.form.get('searchInput')!.valueChanges.subscribe(() => {
      this.startInterval();
    });
    this.form.get('unit')?.valueChanges.subscribe(() => this.onSubmit());
    this.form.get('status')?.valueChanges.subscribe(() => this.onSubmit());
  }

  override resetSearch(): void {
    this.form.reset();
    super.resetSearch();
    this.form.patchValue({unit: ExtendedStatus.ALL});
    this.form.patchValue({status: ExtendedStatus.ALL});
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
  ): Observable<PageResponse<Unit>> {
    return this.unitService.advancedSearch(criteria, sortCriteria);
  }

  protected defineSearchCriteria():
    | AdvancedSearchCriteria
    | AdvancedSearchSimpleCriteria
    | EmptyObject {
    const trigram = this.form.get('searchInput')?.value || '';
    const unitType = this.form.get('unit')?.value || '';
    const status = this.form.get('status')?.value || '';

    if (unitType == ExtendedStatus.ALL && status == ExtendedStatus.ALL) {
      return this.buildCriteriaForAllUnitTypeAndStatus(trigram);

    } else if (unitType == ExtendedStatus.ALL && status != ExtendedStatus.ALL) {
      return this.buildCriteriaForAllUnitType(trigram, status);

    } else if (unitType != ExtendedStatus.ALL && status == ExtendedStatus.ALL) {
      return this.buildCriteriaForStatus(trigram, unitType);

    } else {
      return this.buildGeneralCriteriaForUnit(trigram, unitType, status);
    }
  }

  private buildCriteriaForAllUnitTypeAndStatus(trigram: string): AdvancedSearchSimpleCriteria {
      return {
          field: 'trigram',
          value: trigram,
          operator: AdvancedSearchOperator.IS_LIKE
      };
  }

  private buildCriteriaForAllUnitType(trigram: string, status: string): AdvancedSearchCriteria {
      return {
          operandOne: {
              field: 'trigram',
              value: trigram,
              operator: AdvancedSearchOperator.IS_LIKE
          },
          operandTwo: {
              field: 'status',
              value: status,
              operator: AdvancedSearchOperator.EQUALS
          },
          operator: 'AND'
      };
  }

  private buildCriteriaForStatus(trigram: string, unitType: string): AdvancedSearchCriteria {
      return {
          operandOne: {
              field: 'trigram',
              value: trigram,
              operator: AdvancedSearchOperator.IS_LIKE
          },
          operandTwo: {
              field: 'type',
              value: unitType,
              operator: AdvancedSearchOperator.EQUALS
          },
          operator: 'AND'
      };
  }

  private buildGeneralCriteriaForUnit(trigram: string, unitType: string, status: string): AdvancedSearchCriteria {
      return {
          operandOne: {
              field: 'trigram',
              value: trigram,
              operator: AdvancedSearchOperator.IS_LIKE
          },
          operandTwo: {
              operandOne: {
                  field: 'type',
                  value: unitType,
                  operator: AdvancedSearchOperator.EQUALS
              },
              operandTwo: {
                  field: 'status',
                  value: status,
                  operator: AdvancedSearchOperator.EQUALS
              },
              operator: 'AND'
          },
          operator: 'AND'
      };
  }


  protected defineSortCriteria(): string | { [key: string]: 'asc' | 'desc' } {
    return { trigram: 'asc' };
  }


  onNewClick(): void {
    this.router.navigate([RoutesEnum.NEW], { relativeTo: this.activatedRoute });
  }

  onEditClick(unit: Unit): void {
    this.router.navigate([unit.id], {
      relativeTo: this.activatedRoute
    });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
  }

  onSortChange(sort: { field: string; direction: 'asc' | 'desc' | '' }) {
    this.changeSort(sort.field, sort.direction || 'asc');
  }
}
