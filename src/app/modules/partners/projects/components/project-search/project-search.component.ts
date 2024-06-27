import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Column } from '@shared/components/generic-table/models/column.model';
import { Role } from '@shared/enums/role.enum';
import { Project } from '@shared/models/project.model';
import { PageResponse } from '@shared/models/page-response.model';
import { ProjectService } from '@shared/services/project.service';
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
import { ProjectTableColumns } from '../../constants/project-table-columns.constant';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { ProjectFilter } from '@shared/models/project-filter.model';

export const DISABLED_FILTER = null;

@Component({
  selector: 'app-project-search',
  templateUrl: './project-search.component.html',
  styleUrls: ['./project-search.component.scss']
})
export class ProjectSearchComponent extends AdvancedSearchBasePageComponent<PageResponse<Project>> {
  opProjectType: any;
  opStatus: any;
  ROLE_VISIBILITY = ROLE_VISIBILITY;
  content: string = RoutesEnum.PROJECTS;
  Role = Role;
  columns: Column[] = ProjectTableColumns.filter(
    (col) => col.attributeName !== 'estimatedCost' && col.attributeName !== 'actualCost'
  );
  projectFilter: ProjectFilter;
  userRole: string[] = [];

  form = new FormGroup({
    searchInput: new FormControl('')
  });

  private searchSubscription!: Subscription;
  private searchTimer: any;
  private searchDelay = 300;

  constructor(
    injector: Injector,
    ngxUiLoaderService: NgxUiLoaderService,
    private readonly ProjectService: ProjectService,
    public readonly roleService: RolePermissionService,
    private readonly router: Router
  ) {
    super(injector, ngxUiLoaderService);
    this.visibleColumns();
    this.projectFilter = this.initializeProjectFilter();
    this.startSearchOnInit = true;
    this.searchSubscription = this.form.get('searchInput')!.valueChanges.subscribe(() => {
      this.startInterval();
    });
  }
  override resetSearch(): void {
    this.form.reset();
    this.projectFilter = this.initializeProjectFilter();
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


  private initializeProjectFilter(): ProjectFilter {
      return {
        industry: DISABLED_FILTER,
        PRESALE_id: DISABLED_FILTER,
        DUM_id: DISABLED_FILTER,
        bmTrigram: DISABLED_FILTER,
        PM_id: DISABLED_FILTER,
        status: DISABLED_FILTER
      };
    }

  private visibleColumns(): void {
    this.userRole = this.roleService.getUserRole();
    if (
      this.userRole.includes(Role.ADMIN) ||
      this.userRole.includes(Role.GDM) ||
      this.userRole.includes(Role.DUM)
    )
      this.columns = ProjectTableColumns;
  }

  onProjectFilterChanged(event: ProjectFilter): void {
    this.projectFilter = event;
    this.onSubmit();
  }

  protected search(
    criteria?: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria,
    sortCriteria?: PagingAndSortingCriteria
  ): Observable<PageResponse<Project>> {
    return this.ProjectService.advancedSearch(criteria, sortCriteria);
  }

  protected defineSearchCriteria():
    | AdvancedSearchCriteria
    | AdvancedSearchSimpleCriteria
    | EmptyObject {
    const name = this.form.get('searchInput')?.value || '';
    const industry = this.projectFilter?.industry ?? null;
    const presale = this.projectFilter?.PRESALE_id ?? null;
    const dum = this.projectFilter?.DUM_id ?? null;
    const bmTrigram = this.projectFilter?.bmTrigram ?? null;
    const pm = this.projectFilter?.PM_id ?? null;
    const status = this.projectFilter.status ?? null;

    const criteriaArray: (AdvancedSearchCriteria | AdvancedSearchSimpleCriteria)[] = [];

    const fullNameOperand = this.getFullNameOperand(name);

    criteriaArray.push(fullNameOperand);

    if (industry !== DISABLED_FILTER) {
      const industryOperand = this.getIndustryOperand(industry);
      criteriaArray.push(industryOperand);
    }
    if (presale !== DISABLED_FILTER) {
      const presaleOperand = this.getPresaleOperand(presale);
      criteriaArray.push(presaleOperand);
    }
    if (dum !== DISABLED_FILTER) {
      const dumOperand = this.getDumOperand(dum);
      criteriaArray.push(dumOperand);
    }
    if (bmTrigram !== DISABLED_FILTER) {
      const bmOperand = this.getBmOperand(bmTrigram);
      criteriaArray.push(bmOperand);
    }
    if (pm !== DISABLED_FILTER) {
      const pmOperand = this.getPmOperand(pm);
      criteriaArray.push(pmOperand);
    }
    if (status !== DISABLED_FILTER){
      const statusOperand = this.getStatusOperand(status);
      criteriaArray.push(statusOperand);
    }

    const result: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria =
      this.createAndComplexCriteria(criteriaArray);

    return result;
  }

  private getIndustryOperand(industry: String): AdvancedSearchSimpleCriteria {
    return {
      field: 'industry',
      value: industry,
      operator: AdvancedSearchOperator.IS_LIKE
    };
  }
  private getFullNameOperand(fullName: String): AdvancedSearchSimpleCriteria {
    return {
      field: 'name',
      value: fullName,
      operator: AdvancedSearchOperator.IS_LIKE
    };
  }

  private getPresaleOperand(presale: number): AdvancedSearchSimpleCriteria {
    return {
      field: 'PRESALE.id',
      value: presale,
      operator: AdvancedSearchOperator.EQUALS
    };
  }
  private getDumOperand(dum: number): AdvancedSearchSimpleCriteria {
    return {
      field: 'DUM.id',
      value: dum,
      operator: AdvancedSearchOperator.EQUALS
    };
  }

  private getPmOperand(pm: number): AdvancedSearchSimpleCriteria {
      return {
        field: 'allocations.resource.id - allocations.role',
        value:  pm + "-" + Role.PM,
        operator: AdvancedSearchOperator.RES_ID_AND_ROLE
     };
  }
  
  private getStatusOperand(status: String): AdvancedSearchSimpleCriteria {
    return {
      field: 'status',
      value: status,
      operator: AdvancedSearchOperator.EQUALS
    };
}

  private getBmOperand(bmTrigram: String): AdvancedSearchSimpleCriteria {
    return {
      field: 'bmTrigram',
      value: bmTrigram,
      operator: AdvancedSearchOperator.IS_LIKE
    };
  }

  protected defineSortCriteria(): string | { [key: string]: 'asc' | 'desc' } {
    return { name: 'asc' };
  }

  onNewClick(): void {
    this.router.navigate([RoutesEnum.NEW], { relativeTo: this.activatedRoute });
  }

  onEditClick(Project: Project): void {
    this.router.navigate([Project.id], {
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
