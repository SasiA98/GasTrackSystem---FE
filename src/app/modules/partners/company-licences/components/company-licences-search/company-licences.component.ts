import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CompanyLicence } from '@shared/models/company-licence.model';
import { CompanyLicenceService } from '@shared/services/company-licence.service';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { CompanyLicenceTableAction } from '../../constants/company-licences-table-actions.constant';
import { CompanyLicenceTableColumns } from '../../constants/company-licences-table-columns.constant';
import { CompanyLicencesCreationDialogComponent } from '../company-licences-creation-dialog/company-licences-creation-dialog.component';


@Component({
  selector: 'app-company-licences',
  templateUrl: './company-licences.component.html',
  styleUrls: ['./company-licences.component.scss']
})
export class CompanyLicencesSearchComponent extends AdvancedSearchBasePageComponent<PageResponse<CompanyLicence>> {

  actions = CompanyLicenceTableAction;
  columns = CompanyLicenceTableColumns;
  ROLE_VISIBILITY = ROLE_VISIBILITY;

  form = new FormGroup({
    searchInput: new FormControl('')
  });

  private searchSubscription!: Subscription;
  private searchTimer: any;
  private searchDelay = 300;


  constructor(
    injector: Injector,
    ngxUiLoaderService: NgxUiLoaderService,
    private readonly companyLicenceService: CompanyLicenceService,
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
 
  protected search(
    criteria?: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria,
    sortCriteria?: PagingAndSortingCriteria
  ): Observable<PageResponse<CompanyLicence>> {
    return this.companyLicenceService.advancedSearch(criteria, sortCriteria);
  }


  protected defineSearchCriteria():
  | AdvancedSearchCriteria
  | AdvancedSearchSimpleCriteria
  | EmptyObject {

    const name = this.form.get('searchInput')?.value || "";

    const criteriaArray: (AdvancedSearchCriteria | AdvancedSearchSimpleCriteria)[] = [];

    const companyNameOperand = this.getCompanyNameOperand(name);
    const licenceNameOperand = this.getLicenceNameOperand(name);

    criteriaArray.push(companyNameOperand);
    criteriaArray.push(licenceNameOperand);


    const result: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria = this.createOrComplexCriteria(criteriaArray);

    return result;
  }


  private getLicenceNameOperand(name: String): AdvancedSearchSimpleCriteria {
    return {
        field: 'licenceName',
        value: name,
        operator: AdvancedSearchOperator.IS_LIKE
    }
  }

  

  private getCompanyNameOperand(name: String): AdvancedSearchSimpleCriteria {
    return {
        field: 'company.name',
        value: name,
        operator: AdvancedSearchOperator.IS_LIKE
    }
  }

  openCreationDialog(): void {
    const dialogRef = this.dialog.open(CompanyLicencesCreationDialogComponent, {
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.onSubmit();
        this.showSuccessMessage();
      }
    });
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
  

  
  onActionClick(model: any, operation: number) {
    switch (operation) {
    }
  }


  protected defineSortCriteria(): string | { [key: string]: 'asc' | 'desc' } {
    return { "company.name" : 'asc' };
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
