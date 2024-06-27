import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from '@shared/enums/role.enum';
import { Resource } from '@shared/models/resource.model';
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
import { MatDialog } from '@angular/material/dialog';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { OperationManager } from '@shared/models/operation-manager.model';
import { OfficalTrigramsTableColumns } from '../../constants/official-trigram-table-columns.constant';
import { OfficialTrigramsService } from '@shared/services/official-trigrams.service';
import { OfficialTrigramCreationDialogComponent } from '../official-trigrams-creation-dialog/official-trigrams-creation-dialog.component';
import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { OfficialtrigramTableAction } from '../../constants/official-trigram-table-actions.constant';
import { OfficialTrigramDeleteDialogComponent } from '../official-trigrams-delete-dialog/official-trigrams-delete-dialog.component';

export const DISABLED_FILTER = null;


@Component({
  selector: 'app-official-trigrams',
  templateUrl: './official-trigrams.component.html',
  styleUrls: ['./official-trigrams.component.scss']
})

export class OfficialTrigramsComponent extends AdvancedSearchBasePageComponent<PageResponse<OperationManager>> {
  columns = OfficalTrigramsTableColumns;
  actions = OfficialtrigramTableAction;
  ROLE_VISIBILITY = ROLE_VISIBILITY;
  Role = Role;
  form = new FormGroup({
    searchInput: new FormControl('')
  });
  userRole: string[] = [];
  private searchSubscription!: Subscription;
  private searchTimer: any;
  private searchDelay = 300;

  constructor(
    injector: Injector,
    ngxUiLoaderService: NgxUiLoaderService,
    private readonly officialTrigramService: OfficialTrigramsService,
    private readonly translateService: TranslateService,
    private readonly toastrService: ToastrService,
    public readonly roleService: RolePermissionService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {
    super(injector, ngxUiLoaderService);
    this.startSearchOnInit = true;
    this.searchSubscription = this.form.get('searchInput')!.valueChanges.subscribe(() => {
      this.startInterval();
    });
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
  ): Observable<PageResponse<OperationManager>> {
    return this.officialTrigramService.advancedSearch(criteria, sortCriteria);
  }

  protected defineSearchCriteria():
    | AdvancedSearchCriteria
    | AdvancedSearchSimpleCriteria
    | EmptyObject {

    const fullName = this.form.get('searchInput')?.value || "";

    const criteriaArray: (AdvancedSearchCriteria | AdvancedSearchSimpleCriteria)[] = [];

    const fullNameOperand = this.getFullNameOperand(fullName);

    criteriaArray.push(fullNameOperand);


    const result: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria = this.createAndComplexCriteria(criteriaArray);

    return result;
  }

  onActionClick(model: any, operation: number) {
    switch (operation) {
      case TableOperation.EDIT: this.onDetailClick(model); break;
      case TableOperation.DELETE: this.onDeleteClick(model); break;
    }
  }

  onDetailClick(officialTrigram: OperationManager) {

    const dialogRef = this.dialog.open(OfficialTrigramCreationDialogComponent, {
      data: officialTrigram
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onSubmit();
      this.showSuccessMessage();
    });
  }

  onDeleteClick(officialTrigram: OperationManager) {

    const dialogRef = this.dialog.open(OfficialTrigramDeleteDialogComponent, {
      data: officialTrigram
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onSubmit();
    });
  }

  openCreationDialog(): void {
    const dialogRef = this.dialog.open(OfficialTrigramCreationDialogComponent, {
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.onSubmit();
        this.showSuccessMessage();
      }
    });
  }



  private getFullNameOperand(fullName: String): AdvancedSearchSimpleCriteria {
    return {
        field: 'name',
        value: fullName,
        operator: AdvancedSearchOperator.IS_LIKE
    }
  }

  protected defineSortCriteria(): string | { [key: string]: 'asc' | 'desc' } {
    return { name: 'asc' };
  }

  onNewClick(): void {
    this.router.navigate([RoutesEnum.NEW], { relativeTo: this.activatedRoute });
  }

  onEditClick(resource: Resource): void {
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

  eraseSearch(): void {
    this.form.reset();
    this.onSubmit();
  }
  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }
}
