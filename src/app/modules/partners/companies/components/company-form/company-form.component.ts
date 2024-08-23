import { Component, Injector } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogConfirmComponent } from '@shared/components/dialog-confirm/dialog-confirm.component';
import { Role } from '@shared/enums/role.enum';
import { UnitType } from '@shared/enums/type.enum';
import { UtilService } from '@shared/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, takeUntil } from 'rxjs';
import { FormBasePageComponent } from 'src/app/base/base-page/form-base-page.component';
import { Resource } from '@shared/models/resource.model';
import { Status } from '@shared/enums/status.enum';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { Company } from '@shared/models/company.model';
import { CompanyService } from '@shared/services/company.service';
import { CompanyLicence } from '@shared/models/company-licence.model';
import { CompanyLicencesTableColumns } from '../../constants/company-licences-table-columns.constant';
import { CompanyLicencesUploadDialogComponent } from '../../../company-licences/components/company-licences-upload-dialog/company-licences-upload-dialog.component';
import { CompanyLicencesCreationDialogComponent } from '../../../company-licences/components/company-licences-creation-dialog/company-licences-creation-dialog.component';
import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { CompanyLicenceService } from '@shared/services/company-licence.service';
import { CompanyLicencesSendEmailDialogComponent } from '../../../company-licences/components/company-licences-send-email-dialog/company-licences-send-email-dialog.component';
import { CompanyLicenceTableAction } from '../../constants/company-licences-table-actions.constant';


export function emailValidator(required: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Regex to validate email
    const valid = emailRegex.test(control.value);

    if (required) {
      return valid ? null : { invalidEmail: { value: control.value } };
    } else {
      return control.value ? (valid ? null : { invalidEmail: { value: control.value } }) : null;
    }
  };
}


@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})

export class CompanyFormComponent extends FormBasePageComponent<Company> {
  Role = Role;
  UnitType = UnitType;
  Status = Status;
  resources: Resource[] = [];
  companyName: string | number = '';
  ROLE_VISIBILITY = ROLE_VISIBILITY;
  companyLicences?: CompanyLicence[] = [];
  columnsCompanyLicences= CompanyLicencesTableColumns;
  actions = CompanyLicenceTableAction;

  constructor(
    injector: Injector,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    public readonly roleService: RolePermissionService,
    private readonly companyLicenceService: CompanyLicenceService,
    private readonly companyService: CompanyService,
    private readonly translateService: TranslateService,
    public readonly dialog: MatDialog
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.isInsert()) {
      this.setCompanyNameInTheHTMLTitle();
      this.setCompanyLicences();
    }
  }


  private setCompanyLicences(){
    this.companyService.getCompanyLicenceById(String(this.idModel)).subscribe((companyLicences: CompanyLicence []) => {
      this.companyLicences = companyLicences;
    });
  }

  private setCompanyNameInTheHTMLTitle(){
    if (this.idModel !== undefined) {
      this.companyService.get(String(this.idModel)).subscribe(
        (company: Company) => { this.companyName = company.name; }
      );
    }
  }


  protected submitComplete(response: Company): void {
    this.showSuccessMessage();
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    this.model = response;
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      firstEmail: new FormControl('', [Validators.required, Validators.maxLength(255), emailValidator(true), Validators.minLength(8)]),
      secondEmail: new FormControl('', [Validators.maxLength(255), emailValidator(false), Validators.minLength(8)]),
      thirdEmail: new FormControl('', [Validators.maxLength(255), emailValidator(false), Validators.minLength(8)]),
      address: new FormControl('', [Validators.maxLength(255)]),
      regione: new FormControl('', [Validators.maxLength(255)]),
      provincia: new FormControl('', [Validators.maxLength(255)]),
      citta: new FormControl('', [Validators.maxLength(255)]),
      code: new FormControl('', [Validators.maxLength(20)]),
      phone: new FormControl('', [Validators.maxLength(14)]),
      owner: new FormControl('', [Validators.maxLength(255)])
    });
  }

  protected convertDataToModel(form: FormGroup): Company {
    return UtilService.removeNull(form.getRawValue());
  }

  protected save(model: Company): Observable<Company> {
    return this.companyService.save(model);
  }

  protected update(id: string | number, model: Company): Observable<Company> {
    return this.companyService.update(id, model);
  }

  getPathKey(): string {
    return 'id';
  }

  getModelById(id: string | number): Observable<Company> {
    return this.companyService.get(id);
  }

  onSettingClick(): void {
    if (this.form.dirty) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '250px',
        data: { text: 'Unsaved changes will be lost. Are you sure?' }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) this.goToSetting();
      });
    } else this.goToSetting();
  }

  onActionClick(model: any, operation: number) {
    
    console.log(operation);
    switch (operation) {
      case TableOperation.EDIT: this.onDetailClick(model); break;
      case TableOperation.SEND_EMAIL: this.onSendEmailClick(model); break;
      case TableOperation.UPLOAD: this.onUploadDocumentClick(model); break;
      case TableOperation.DOWNLOAD: this.onDownloadDocumentsClick(model); break;
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

  
  goToSetting() {
    this.router.navigate(['./setting'], { relativeTo: this.activatedRoute.parent });
  }

  goBack(): void {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }

  onDeleteClick(): void {
    if (this.idModel) {
      this.companyService
        .delete(this.idModel)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.showSuccessMessage();
          this.goBack();
        });
    }
  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }

}
