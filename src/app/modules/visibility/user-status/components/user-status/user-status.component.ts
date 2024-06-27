import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { Column } from '@shared/components/generic-table/models/column.model';
import { Role } from '@shared/enums/role.enum';
import { PageResponse } from '@shared/models/page-response.model';
import { User } from '@shared/models/user.model';
import { AdvancedSearchBasePageComponent } from 'src/app/base/base-page/advanced-search-base-page.component';
import { AdvancedSearchCriteria } from 'src/app/base/models/advanced-search/advanced-search-criteria.model';
import { AdvancedSearchOperator } from 'src/app/base/models/advanced-search/advanced-search-operator.enum';
import { AdvancedSearchSimpleCriteria } from 'src/app/base/models/advanced-search/advanced-search-simple-criteria.model';
import { PagingAndSortingCriteria } from 'src/app/base/models/paging-and-sorting-criteria.model';
import { EmptyObject } from 'src/app/base/types/empty-object.type';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/modules/partners/users/services/user.service';
import { UserStatusTableColumns } from '../../constants/user-status-table-columns-constant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss']
})
export class UserStatusComponent extends AdvancedSearchBasePageComponent<
  PageResponse<User>
> {
  columns: Column[] = UserStatusTableColumns;

  tableAction: { title: string; operation: TableOperation }[] = [
    {
      title: 'Show products',
      operation: TableOperation.SHOW_DETAIL
    }
  ];

  form = new FormGroup({
    searchInput: new FormControl(''),
    advancedFilter: new FormControl()
  });

  constructor(
    injector: Injector,
    ngxUiLoaderService: NgxUiLoaderService,
    private readonly userService: UserService,
    private readonly bottomSheet: MatBottomSheet
  ) {
    super(injector, ngxUiLoaderService);
    this.startSearchOnInit = true;
  }

  override resetSearch(): void {
    this.form.reset();
    super.resetSearch();
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
    const value = this.form.get('searchInput')?.value || '';
    return {
      operandOne: {
        field: 'relatedNotifications',
        value: '1',
        operator: AdvancedSearchOperator.IS_GTE
      },
      operandTwo: {
        operandOne: {
          field: 'name',
          value,
          operator: AdvancedSearchOperator.IS_LIKE
        },
        operandTwo: {
          field: 'surname',
          value,
          operator: AdvancedSearchOperator.IS_LIKE
        },
        operator: 'OR'
      },
      operator: 'AND'
    };
  }

  protected defineSortCriteria(): string | { [key: string]: 'asc' | 'desc' } {
    return { name: 'asc' };
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
  }

  onSortChange(sort: { field: string; direction: 'asc' | 'desc' | '' }) {
    this.changeSort(sort.field, sort.direction || 'asc');
  }


  onShowClick({ model }: { model: User }): void {
    let searchCriteria = {};
    /*if (model.roles.includes(Role.USER)) {
      searchCriteria = {
        field: 'utilizers.id',
        value: model.id,
        operator: AdvancedSearchOperator.EQUALS
      };
    } else if (model.roles.includes(Role.PRODUCT_MANAGER)) {
      searchCriteria = {
        field: 'productManager.id',
        value: model?.id,
        operator: AdvancedSearchOperator.EQUALS
      };
    }*/
  }
}
