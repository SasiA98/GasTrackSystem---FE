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
import { map, Observable, of, startWith } from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material/core';


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
  companiesOb?: Observable<Company[]> = of([]);
  licencesOb?: Observable<Licence[]> = of([]);


  constructor(
    private readonly companyService: CompanyService,
    private readonly licenceService: LicenceService,
    private readonly companyLicenceService: CompanyLicenceService,
    public dialogRef: MatDialogRef<CompanyLicencesCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyLicence
  ) {

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

    this.companyService.getAll().subscribe(companies => {
      this.companies = companies;
      this.initializeCompaniesOb();
    });
    
    this.licenceService.getAll().subscribe(licences => {
      this.licences = licences;
      this.initializeLicencesOb();
    });
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


  displayFnAutocompleteCompanies(id: number) {
    const c = this.companies.find(company => company.id === id);
    return c ? `${c.name}` : '';
  }

  displayFnAutocompleteLicences(id: number) {
    const c = this.licences.find(licence => licence.id === id);
    return c ? `${c.name}` : '';
  }

  filterCompaniesByLabel(options: Company[], label: string): Company[] {    
    const value = label.trim().toLowerCase();
    return options.filter((option: Company) => {
      const fullName = `${option.name.toLowerCase()}`;
      return fullName.includes(value);
    });
  }

  filterLicencesByLabel(options: Licence[], label: string): Licence[] {    
    const value = label.trim().toLowerCase();
    return options.filter((option: Licence) => {
      const fullName = `${option.name.toLowerCase()}`;
      return fullName.includes(value);
    });
  }

  
  initializeCompaniesOb() : void {
      this.companiesOb = this.form.get('company')?.get('id')?.valueChanges.pipe(
      startWith(''),
      map((value: string|Company) => {
        if (typeof value === 'string') {
          return this.filterCompaniesByLabel(this.companies, value);
        }
        return this.companies;
      }));
  }


  initializeLicencesOb() : void {
    
    this.licencesOb = this.form.get('licence')?.get('id')?.valueChanges.pipe(
    startWith(''),
    map((value: string|Company) => {
      if (typeof value === 'string') {
        return this.filterLicencesByLabel(this.licences, value);
      }
      return this.licences;
    }));
  }
  
}
