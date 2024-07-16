import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Allocation } from '@shared/models/allocation.model';
import { AllocationService } from '@shared/services/allocation.service';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { ToastrService } from 'ngx-toastr';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { CompanyLicence } from '@shared/models/company-licence.model';
import { CompanyLicenceService } from '@shared/services/company-licence.service';

@Component({
  selector: 'app-company-licences-send-email-dialog',
  templateUrl: './company-licences-send-email-dialog.component.html',
  styleUrls: ['./company-licences-send-email-dialog.component.scss']
})
export class CompanyLicencesSendEmailDialogComponent {


  constructor(
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
    private readonly companyLicenceService: CompanyLicenceService,
    public dialogRef: MatDialogRef<CompanyLicencesSendEmailDialogComponent>,
    private readonly roleService: RolePermissionService,
    @Inject(MAT_DIALOG_DATA) public companyLicence: CompanyLicence) {

  }



  onSubmit(): void {

    var companyLicenceId = this.companyLicence.id;

    if (companyLicenceId != null) {
      this.companyLicenceService.sendEmail(companyLicenceId).subscribe(() => {
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
