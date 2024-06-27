import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { BaseModel } from "src/app/base/models/base-model.model";

@Component({
  selector: 'app-filter-base-dialog',
  template: `
        <p>
          base works!
        </p>
      `
})

export abstract class FilterBaseDialogComponent {

  dialogForm: FormGroup;
  abstract createForm(filter: BaseModel): FormGroup;

  constructor(
    protected fb: FormBuilder,
    protected dialogRef: MatDialogRef<FilterBaseDialogComponent>,
    @Inject('BaseModelToken') protected filter: BaseModel) {

     this.dialogForm = this.createForm(filter);
  }


  apply() {
    if (this.dialogForm.valid) {
      this.dialogRef.close(this.dialogForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
