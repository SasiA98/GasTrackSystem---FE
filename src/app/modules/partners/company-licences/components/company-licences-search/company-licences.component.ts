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
import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { CompanyLicencesSendEmailDialogComponent } from '../company-licences-send-email-dialog/company-licences-send-email-dialog.component';
import { CompanyLicencesUploadDialogComponent } from '../company-licences-upload-dialog/company-licences-upload-dialog.component';
import { CompanyLicencesDeleteDialogComponent } from '../company-licences-delete-dialog/company-licences-delete-dialog.component';



@Component({
  selector: 'app-company-licences',
  templateUrl: './company-licences.component.html',
  styleUrls: ['./company-licences.component.scss']
})
export class CompanyLicencesSearchComponent extends AdvancedSearchBasePageComponent<PageResponse<CompanyLicence>> {

  actions = CompanyLicenceTableAction;
  columns = CompanyLicenceTableColumns;
  ROLE_VISIBILITY = ROLE_VISIBILITY;

  months = [
    { value: 1, viewValue: 'Gennaio' },
    { value: 2, viewValue: 'Febbraio' },
    { value: 3, viewValue: 'Marzo' },
    { value: 4, viewValue: 'Aprile' },
    { value: 5, viewValue: 'Maggio' },
    { value: 6, viewValue: 'Giugno' },
    { value: 7, viewValue: 'Luglio' },
    { value: 8, viewValue: 'Agosto' },
    { value: 9, viewValue: 'Settembre' },
    { value: 10, viewValue: 'Ottobre' },
    { value: 11, viewValue: 'Novembre' },
    { value: 12, viewValue: 'Dicembre' }
  ];

  years: number[] = [];

  form = new FormGroup({
    searchInput: new FormControl(''),
    month: new FormControl(new Date().getMonth() + 1),
    year: new FormControl(new Date().getFullYear())
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
    this.generateYears();

    this.startSearchOnInit = true;
    this.searchSubscription = this.form.get('searchInput')!.valueChanges.subscribe(() => {
      this.startInterval();
    });

    this.form.get('month')?.valueChanges.subscribe(() => this.onSubmit());
    this.form.get('year')?.valueChanges.subscribe(() => this.onSubmit());
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;
    const endYear = currentYear + 3;
    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }
  }


  override resetSearch(): void {
    this.form.reset();
    super.resetSearch();
    this.form.patchValue({month: new Date().getMonth() + 1});
    this.form.patchValue({year: new Date().getFullYear()});
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
    const month = this.form.get('month')?.value || 1;
    const year = this.form.get('year')?.value || 2024;


    const criteriaArray: (AdvancedSearchCriteria | AdvancedSearchSimpleCriteria)[] = [];

    const nameOperand = this.getNameOperand(name);

    const date = new Date(year, month - 1);
    const expiryDateOperand = this.getExpiryDateOperand(date);

    criteriaArray.push(nameOperand);
    criteriaArray.push(expiryDateOperand);

    const result: AdvancedSearchCriteria | AdvancedSearchSimpleCriteria = this.createAndComplexCriteria(criteriaArray);

    return result;
  }


  private getExpiryDateOperand(date: Date): AdvancedSearchCriteria {
    return {
          operandOne: {
            field: 'expiryDate',
            value: date,
            operator: AdvancedSearchOperator.IS_DATE_GTE
          },
          operandTwo: {
            field: 'expiryDate',
            value: 'null',
            operator: AdvancedSearchOperator.IS_NULL
          },
          operator: 'OR',
    };
  }


  private getNameOperand(name: String): AdvancedSearchCriteria {
    return {
      operandOne: {
        field: 'company.name',
        value: name,
        operator: AdvancedSearchOperator.IS_LIKE
      },
      operandTwo: {
        field: 'licence.name',
        value: name,
        operator: AdvancedSearchOperator.IS_LIKE
      },
      operator: 'OR',
   };
  }

  openCreationDialog(): void {
    const dialogRef = this.dialog.open(CompanyLicencesCreationDialogComponent, {
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.onSubmit();
        this.showSuccessMessage();
        this.resetSearch();
      }
    });
  }

  onActionClick(model: any, operation: number) {

    console.log(operation);
    switch (operation) {
      case TableOperation.EDIT: this.onDetailClick(model); break;
      case TableOperation.SEND_EMAIL: this.onSendEmailClick(model); break;
      case TableOperation.UPLOAD: this.onUploadDocumentClick(model); break;
      case TableOperation.DOWNLOAD: this.onDownloadDocumentsClick(model); break;
      case TableOperation.DELETE: this.onDeleteClick(model); break;
    }
  }

  onDetailClick(companyLicence: CompanyLicence) {

    const dialogRef = this.dialog.open(CompanyLicencesCreationDialogComponent, {
      data: companyLicence
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onSubmit();
      this.showSuccessMessage();

    });
  }

  onUploadDocumentClick(companyLicence: CompanyLicence) {

    const dialogRef = this.dialog.open(CompanyLicencesUploadDialogComponent, {
      data: companyLicence
    });
  }


  onDownloadDocumentsClick(companyLicence: CompanyLicence) {

    if(companyLicence.id == undefined)
      return;

    this.companyLicenceService.getFile(companyLicence.id).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const filename = this.getFileNameFromUrl(companyLicence);

        var linkToFile = document.createElement('a');
        linkToFile.download = filename;
        linkToFile.href = url;
        linkToFile.click();

        this.showSuccessMessage();
      },
      error => {
        console.error('Error:', error);
      }
    );

  }


  getFileNameFromUrl(companyLicence: CompanyLicence): string {
    const companyName = companyLicence.company.name.trim();
    const licenceName = companyLicence.licence.name.trim();
    const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '');
    const cleanLicenceName = licenceName.replace(/[^a-zA-Z0-9]/g, '');
    return cleanCompanyName + "-" + cleanLicenceName + ".zip";
  }


  onSendEmailClick(companyLicence: CompanyLicence) {

    const dialogRef = this.dialog.open(CompanyLicencesSendEmailDialogComponent, {
      data: companyLicence
    });
  }

  onDeleteClick(companyLicence: CompanyLicence) {
    const dialogRef = this.dialog.open(CompanyLicencesDeleteDialogComponent, {
      data: companyLicence
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onSubmit();
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
