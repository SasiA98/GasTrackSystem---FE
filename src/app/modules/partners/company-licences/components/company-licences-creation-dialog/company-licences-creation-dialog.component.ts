import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '@shared/services/company.service';
import { CompanyLicenceService } from '@shared/services/company-licence.service';
import { Industry } from '@shared/enums/industry.enum';
import { CompanyLicence } from '@shared/models/company-licence.model';
import { Company } from '@shared/models/company.model';
import { Licence } from '@shared/models/licence.model';
import { LicenceService } from '@shared/services/licence.service';


@Component({
  selector: 'app-company-licences-creation-dialog',
  templateUrl: './company-licences-creation-dialog.component.html',
  styleUrls: ['./company-licences-creation-dialog.component.scss']
})
export class CompanyLicencesCreationDialogComponent {
  form: FormGroup;
  Industry = Industry;
  companies: Company[] = [];
  licences: Licence[] = [];


  constructor(
    private readonly companyService: CompanyService,
    private readonly licenceService: LicenceService,
    private readonly companyLicenceService: CompanyLicenceService,
    public dialogRef: MatDialogRef<CompanyLicencesCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyLicence
  ) {

    this.companyService.getAll().subscribe(companies => this.companies = companies);
    this.licenceService.getAll().subscribe(licences => this.licences = licences);

    this.form = this.createForm();
    if (this.data) {
      this.form.patchValue({
        company: {
          id: this.data.company.id
        },
        licence: {
          id: this.data.licence.id
        },        
        expiryDate: this.data.expiryDate,

      });
    }
  }



  private createForm(): FormGroup {
    return new FormGroup({
      company: new FormGroup({
        id: new FormControl('', [Validators.required])
      }),
      licence: new FormGroup({
        id: new FormControl('', [Validators.required])
      }),
      expiryDate: new FormControl(),
    });
  }


  onSubmit(): void {
    const companyLicence = this.form.value;
    if (this.data != null && this.data.id) {
      this.companyLicenceService.update(this.data.id, companyLicence).subscribe(
        () => {
          this.dialogRef.close(companyLicence);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
    this.companyLicenceService.save(companyLicence).subscribe(
      () => {
        this.dialogRef.close(companyLicence);
      },
      (error) => {
        console.log(error);
      }
    );
  }
    this.dialogRef.close(this.form.value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
