import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CompanyLicence } from '@shared/models/company-licence.model';
import { CompanyLicenceService } from '@shared/services/company-licence.service';
import { map } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-licences-upload-dialog',
  templateUrl: './company-licences-upload-dialog.component.html',
  styleUrls: ['./company-licences-upload-dialog.component.scss']
})
export class CompanyLicencesUploadDialogComponent {

  form: FormGroup;
  isFileUploaded: boolean = false;

  fileName: string = '';
  uploadingFile: boolean = false;
  uploadProgress: number = 0;
  errorMessage: string[] = [];
  permissions: boolean = false;
  isSaveClicked = false;

  constructor(
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
    private readonly companyLicenceService: CompanyLicenceService,
    public dialogRef: MatDialogRef<CompanyLicencesUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public companyLicence: CompanyLicence,
    private fb: FormBuilder) {
      this.form = this.createForm();

      this.dialogRef.beforeClosed().subscribe(() => {
        if (this.isSaveClicked) {
          this.showSuccessMessage();
        }
      });
  }
  


  private createForm(): FormGroup {
    return this.fb.group({
      file: [null, Validators.required]
    });
  }

  fileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({
        file: file
      });
      this.form.get('file')?.updateValueAndValidity();
    }
  }


  onSubmit(): void {
    if (this.form.valid) {
      const fileControl = this.form.get('file');
      const companyLicenceId = this.companyLicence.id;
      if (fileControl && companyLicenceId) {
        const file = fileControl.value as File;
        this.uploadFile(file, companyLicenceId);
      }
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

  uploadFile(file: File, companyLicenceId: number) {
    this.resetUpload(); // Reset before new upload
    this.fileName = file.name;
    this.uploadingFile = true;

    const data = this.companyLicenceService.sendFiles(file, companyLicenceId);

    data.subscribe({
      next: (response: string) => {

        if (response === "File uploaded successfully") {
          this.isSaveClicked = true;
          console.log('ok', response);
          this.dialogRef.close();
        } else {
          console.error('Unexpected response:', response);
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.uploadingFile = false;
      }
    });
  
  }

  resetUpload() {
    this.fileName = '';
    this.uploadingFile = false;
    this.uploadProgress = 0;
    this.errorMessage = [];
  }

}