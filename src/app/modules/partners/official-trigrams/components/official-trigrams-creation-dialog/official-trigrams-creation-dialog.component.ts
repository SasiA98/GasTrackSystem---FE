import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperationManager } from '@shared/models/operation-manager.model';
import { OfficialTrigramsService } from '@shared/services/official-trigrams.service';
import { Industry } from '@shared/enums/industry.enum';

@Component({
  selector: 'app-official-trigrams-creation-dialog',
  templateUrl: './official-trigrams-creation-dialog.component.html',
  styleUrls: ['./official-trigrams-creation-dialog.component.scss']
})
export class OfficialTrigramCreationDialogComponent{
  form: FormGroup;
  Industry = Industry;

  constructor(
    private readonly officialTrigramService: OfficialTrigramsService,
    public dialogRef: MatDialogRef<OfficialTrigramCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OperationManager
  ) {
    this.form = this.createForm();
    if (this.data) {
      this.form.patchValue({
        legalEntity: this.data.legalEntity,
        industry: this.data.industry,
        name: this.data.name,
        trigram: this.data.trigram,
        roles: this.data.roles,
        reportsTo: this.data.reportsTo,
      });
    }
  }



  private createForm(): FormGroup {
    return new FormGroup({
      legalEntity: new FormControl('', [Validators.maxLength(255)]),
      industry: new FormControl(''),
      name: new FormControl('', [Validators.maxLength(255)]),
      trigram: new FormControl('', [Validators.maxLength(3)]),
      roles: new FormControl('', [Validators.maxLength(255)]),
      reportsTo: new FormControl('', [Validators.maxLength(3)]),
    });
  }


  onSubmit(): void {
    const officialTrigram = this.form.value;
    if (this.data != null && this.data.id) {
      this.officialTrigramService.update(this.data.id, officialTrigram).subscribe(
        () => {
          this.dialogRef.close(officialTrigram);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
    this.officialTrigramService.save(officialTrigram).subscribe(
      () => {
        this.dialogRef.close(officialTrigram);
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
