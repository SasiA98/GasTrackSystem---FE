import { Component, Inject } from '@angular/core';
import { Allocation } from '@shared/models/allocation.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllocationService } from '@shared/services/allocation.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-project-allocation-dialog',
  templateUrl: './project-allocation-dialog.component.html',
  styleUrls: ['./project-allocation-dialog.component.scss']
})
export class ProjectAllocationDialogComponent{
  form: FormGroup;
  isRealCommitmentInsertEnabled = false;

  constructor(
    private readonly allocationService: AllocationService,
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
    public dialogRef: MatDialogRef<ProjectAllocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public allocation: Allocation
  ) {
    this.form = this.createForm();
    this.isRealCommitmentInsertEnabled = this.allocation.realCommitment;
    if (this.isRealCommitmentInsertEnabled == true) {
    this.form.patchValue({
      commitment: this.allocation.commitmentPercentage,
    })
    }
    else {
      this.form.patchValue({
        commitment: this.allocation.hours,
      })
    }
  }


  private createForm(): FormGroup {
    return new FormGroup({
      startDate: new FormControl(this.allocation.startDate),
      commitment: new FormControl(''),
      realCommitment: new FormControl(this.allocation.realCommitment),
      endDate: new FormControl(this.allocation.endDate)
    });
  }

  onSubmit(): void {
    const startDate = this.form.get('startDate')?.value || '';
    const endDate = this.form.get('endDate')?.value || '';
    const commitment = this.form.get('commitment')?.value || '';

    var isRealCommitment = this.form.get('realCommitment')?.value;

      if (isRealCommitment) {
        this.allocation.commitmentPercentage = commitment;
        this.allocation.hours = null;
        this.allocation.commitment = null;
      } else {
        this.allocation.hours = commitment;
        this.allocation.commitmentPercentage = null;
        this.allocation.commitment = null;
      }

    if(this.allocation.id != null){
      this.allocation.startDate = startDate;
      this.allocation.endDate = endDate;
      this.allocationService.update(this.allocation.id, this.allocation).subscribe(
        () => {
          this.showSuccessMessage();
          this.dialogRef.close(this.allocation);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.dialogRef.close();
    }
  }

  showSuccessMessage(): void {
    const title = this.translateService.instant('MESSAGES.SUCCESS.TITLE');
    const message = this.translateService.instant('MESSAGES.SUCCESS.DESCRIPTION');
    this.toastrService.success(message, title);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
