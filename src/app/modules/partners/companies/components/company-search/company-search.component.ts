import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Column } from '@shared/components/generic-table/models/column.model';
import { Role } from '@shared/enums/role.enum';
import { PageResponse } from '@shared/models/page-response.model';
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
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { LicenceTableColumns } from '../constants/companies-table-columns.constant';
import { Company } from '@shared/models/company.model';
import { CompanyService } from '@shared/services/company.service';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.scss']
})
export class CompanySearchComponent extends AdvancedSearchBasePageComponent<PageResponse<Company>> {
  
  opUnitType: any;
  opStatus: any;

  content: string = RoutesEnum.COMPANIES;
  Role = Role;
  ROLE_VISIBILITY = ROLE_VISIBILITY;
  columns: Column[] = LicenceTableColumns;

  form = new FormGroup({
    searchInput: new FormControl('')
  });

  private searchSubscription!: Subscription;
  private searchTimer: any;
  private searchDelay = 300;

  constructor(
    injector: Injector,
    ngxUiLoaderService: NgxUiLoaderService,
    private readonly companyService: CompanyService,
    public readonly roleService: RolePermissionService,
    private readonly router: Router
  ) {
    super(injector, ngxUiLoaderService);
    this.startSearchOnInit = true;
    this.searchSubscription = this.form.get('searchInput')!.valueChanges.subscribe(() => {
      this.startInterval();
    });
  }

  override resetSearch(): void {
    this.form.reset();
    super.resetSearch();
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
  ): Observable<PageResponse<Company>> {
    return this.companyService.advancedSearch(criteria, sortCriteria);
  }

  protected defineSearchCriteria():
    | AdvancedSearchCriteria
    | AdvancedSearchSimpleCriteria
    | EmptyObject {
    const name = this.form.get('searchInput')?.value || '';
    return this.buildCriteriaForCompanyName(name);
  }

  private buildCriteriaForCompanyName(name: string): AdvancedSearchSimpleCriteria {
      return {
          field: 'name',
          value: name,
          operator: AdvancedSearchOperator.IS_LIKE
      };
  }

  protected defineSortCriteria(): string | { [key: string]: 'asc' | 'desc' } {
    return { name: 'asc' };
  }


  onNewClick(): void {
    this.router.navigate([RoutesEnum.NEW], { relativeTo: this.activatedRoute });
  }

  onEditClick(company: Company): void {
    this.router.navigate([company.id], {
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

