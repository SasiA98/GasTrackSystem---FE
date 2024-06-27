import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { OfficialTrigramsService } from '@shared/services/official-trigrams.service';
import { ToastrService } from 'ngx-toastr';
import { OperationManager } from '@shared/models/operation-manager.model';

@Component({
  selector: 'app-official-trigrams-delete-dialog',
  templateUrl: './official-trigrams-delete-dialog.component.html',
  styleUrls: ['./official-trigrams-delete-dialog.component.scss']
})
export class OfficialTrigramDeleteDialogComponent {

  constructor(
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
    private readonly officialTrigramsService: OfficialTrigramsService,
    public dialogRef: MatDialogRef<OfficialTrigramDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public operationManager: OperationManager) {

  }


  onSubmit(): void {

    var operationManagerId = this.operationManager.id;

    if (operationManagerId != null) {
    this.officialTrigramsService.delete(operationManagerId).subscribe(
      () => {
        this.showSuccessMessage();
        this.closeDialog();
      }, error => {
        console.log(error);
      });
    } else {
      this.toastrService.error("User doesn't have permissions", "Error");
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
