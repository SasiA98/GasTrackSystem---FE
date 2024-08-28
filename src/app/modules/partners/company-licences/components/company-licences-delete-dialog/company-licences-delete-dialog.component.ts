import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyLicence } from '@shared/models/company-licence.model';
import { CompanyLicenceService } from '@shared/services/company-licence.service';

@Component({
  selector: 'app-company-licences-delete-dialog',
  templateUrl: './company-licences-delete-dialog.component.html',
  styleUrls: ['./company-licences-delete-dialog.component.scss']
})
export class CompanyLicencesDeleteDialogComponent {


  constructor(
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
    private readonly companyLicenceService: CompanyLicenceService,
    public dialogRef: MatDialogRef<CompanyLicencesDeleteDialogComponent>,
    private readonly roleService: RolePermissionService,
    @Inject(MAT_DIALOG_DATA) public companyLicence: CompanyLicence) {

  }



  onSubmit(): void {

    var companyLicenceId = this.companyLicence.id;

    if (companyLicenceId != null) {
      this.companyLicenceService.deleteById(companyLicenceId).subscribe(() => {
        this.showSuccessMessage();
        this.dialogRef.close();
      }, error => {
        console.log(error);
      });
    }

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }



}
