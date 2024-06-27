import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Column } from '@shared/components/generic-table/models/column.model';
import { Role } from '@shared/enums/role.enum';
import { AuthenticatedUser } from '@shared/models/authenticated-user.model';
import { PageResponse } from '@shared/models/page-response.model';
import { User } from '@shared/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { AuthFacadeService } from '@shared/services/auth/auth-facade.service';
import { AdvancedSearchBasePageComponent } from 'src/app/base/base-page/advanced-search-base-page.component';
import { AdvancedSearchCriteria } from 'src/app/base/models/advanced-search/advanced-search-criteria.model';
import { AdvancedSearchOperator } from 'src/app/base/models/advanced-search/advanced-search-operator.enum';
import { AdvancedSearchSimpleCriteria } from 'src/app/base/models/advanced-search/advanced-search-simple-criteria.model';
import { PagingAndSortingCriteria } from 'src/app/base/models/paging-and-sorting-criteria.model';
import { EmptyObject } from 'src/app/base/types/empty-object.type';
import { Observable, Subscription, takeUntil } from 'rxjs';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { UserTableColumn } from '../../constants/user-table-columns.constant';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { UserFilter } from '@shared/models/user-filter.model';
import { ExtendedStatus } from '@shared/enums/extended-status.enum';
import { UserActionTableColumn } from '../../constants/user-action-table-columns.constants';
import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from '@shared/services/breadcrumb.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent extends AdvancedSearchBasePageComponent<
  PageResponse<User>
> {
  content: string = RoutesEnum.USERS;
  ROLE_VISIBILITY = ROLE_VISIBILITY;
  columns: Column[] = UserTableColumn;
  opOne: any;
  userFilter: UserFilter;
  actions = UserActionTableColumn;

  form = new FormGroup({
    fullName: new FormControl('')
  });
  private searchSubscription!: Subscription;
  private searchTimer: any;
  private searchDelay = 300;
  private currentUser: AuthenticatedUser | undefined;

  constructor(
    injector: Injector,
    ngxUiLoaderService: NgxUiLoaderService,
    private dialog: MatDialog,
    private breadcrumbService: BreadcrumbService,
    private readonly router: Router,
    private readonly userService: UserService,
    public readonly roleService: RolePermissionService,
    private readonly authFacadeService: AuthFacadeService,
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService
  ) {
    super(injector, ngxUiLoaderService);
    this.userFilter = this.initializeUserFilter();
    this.startSearchOnInit = true;
    this.searchSubscription = this.form.get('fullName')!.valueChanges.subscribe(() => {
      this.startInterval();
    });
    this.authFacadeService.getUser().pipe(takeUntil(this.onDestroy$)).subscribe((user) => {
        this.currentUser = user;
      });
  }

  private initializeUserFilter(): UserFilter {
    return {
      roles: [],
      status: ExtendedStatus.ALL
    };
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
  onUserFilterChanged(userFilter: UserFilter): void {
    this.userFilter = userFilter;
    this.onSubmit();
  }

  override resetSearch(): void {
    this.form.reset();
    this.userFilter = this.initializeUserFilter();
    super.resetSearch();
  }

  onActionClick(model: any, operation: number) {
    switch (operation) {
      case TableOperation.DETAIL:
        this.onDetailResourceClick(model);
        break;
      case TableOperation.EDIT:
        this.onDisableClick(model);
        break;
      case TableOperation.MANAGE:
        this.resetPassword(model);
        break;
    }
  }

  onDetailResourceClick(user: User): void {
    if (user.resource.id !== undefined) {
      const link = ['/management', 'resources', user.resource.id];
      const navigationExtras: NavigationExtras = {
        queryParams: {
          from_user: 'user',
          user_id: user.id
        }
      };
      this.router.navigate(link, navigationExtras);
    }
  }

  onDisableClick(user: User): void {
    if (user.resource.id !== undefined) {
      if (user.status === 'Disabled') user.status = 'Enabled';
      else if (user.status === 'Enabled') user.status = 'Disabled';
      this.userService.patch(user.resource.id, user).subscribe(() => {
        this.showSuccessMessage();
      });
    }
  }

  resetPassword(user: User): void {
    if (user.id !== undefined)
      this.userService.resetPassword(user.id).subscribe(() => {
        this.showSuccessMessageFix('Success', 'Password reset successfully');
      });
  }

  protected search(
    criteria?: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria,
    sortCriteria?: PagingAndSortingCriteria
  ): Observable<PageResponse<User>> {
    return this.userService.advancedSearch(criteria, sortCriteria);
  }

  protected defineSearchCriteria():
    | AdvancedSearchCriteria
    | AdvancedSearchSimpleCriteria
    | EmptyObject {
    const fullName = this.form.get('fullName')?.value || '';
    const status = this.userFilter?.status ?? ExtendedStatus.ALL;
    const roles = this.userFilter?.roles ?? [];

    const criteriaArray: (AdvancedSearchCriteria | AdvancedSearchSimpleCriteria)[] = [];

    const fullNameOperand = this.getFullNameOperand(fullName);

    criteriaArray.push(fullNameOperand);

    if (status !== ExtendedStatus.ALL) {
      const statusOperand = this.getStatusOperand(status);
      criteriaArray.push(statusOperand);
    }

    if (roles.length !== 0) {
      const rolesOperand = this.getRolesOperand(roles);
      criteriaArray.push(rolesOperand);
    }

    const result: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria =
      this.createAndComplexCriteria(criteriaArray);

    return result;
  }

  private getFullNameOperand(fullName: String): AdvancedSearchCriteria {
    return {
      operandOne: {
        field: 'resource.name',
        value: fullName,
        operator: AdvancedSearchOperator.IS_LIKE
      },
      operandTwo: {
        field: 'resource.surname',
        value: fullName,
        operator: AdvancedSearchOperator.IS_LIKE
      },
      operator: 'OR'
    };
  }

  private getStatusOperand(status: ExtendedStatus): AdvancedSearchSimpleCriteria {
    return {
      field: 'status',
      value: status,
      operator: AdvancedSearchOperator.EQUALS
    };
  }

  private getRolesOperand(
    roles: Role[]
  ): AdvancedSearchCriteria | AdvancedSearchSimpleCriteria {
    const criteriaList: AdvancedSearchSimpleCriteria[] = [];

    for (const role of roles) {
      const criteria: AdvancedSearchSimpleCriteria = {
        field: 'resource.roles',
        value: role,
        operator: AdvancedSearchOperator.EQUALS
      };
      criteriaList.push(criteria);
    }

    return this.createOrComplexCriteria(criteriaList);
  }

  protected defineSortCriteria(): string | { [key: string]: 'asc' | 'desc' } {
    return {};
  }

  onNewClick(): void {
    this.router.navigate([RoutesEnum.NEW], { relativeTo: this.activatedRoute });
  }

  onEditClick(user: User): void {
    this.router.navigate([user.id], {
      relativeTo: this.activatedRoute
    });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
  }

  onSortChange(sort: { field: string; direction: 'asc' | 'desc' | '' }) {
    this.changeSort(sort.field, sort.direction || 'asc');
  }

  showSuccessMessageFix(title: string, message: string): void {
    title = this.translateService.instant(title);
    message = this.translateService.instant(message);
    this.toastrService.success(message, title);
  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }
}
