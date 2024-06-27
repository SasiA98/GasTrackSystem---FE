import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Allocation } from '@shared/models/allocation.model';
import { AllocationService } from '@shared/services/allocation.service';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { Role } from '@shared/enums/role.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-convert-allocation-dialog',
  templateUrl: './convert-allocation-dialog.component.html',
  styleUrls: ['./convert-allocation-dialog.component.scss']
})
export class ConvertAllocationDialogComponent {

  constructor(
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
    private readonly allocationService: AllocationService,
    public dialogRef: MatDialogRef<ConvertAllocationDialogComponent>,
    private readonly roleService: RolePermissionService,
    @Inject(MAT_DIALOG_DATA) public allocation: Allocation) {

  }

  hasPermissions(): boolean {
    var roles = this.roleService.getUserRole();
    return !(roles.every(role => role === Role.GDM || role === Role.DUM || role === Role.ADMIN || role === Role.PSE || role === Role.PSL || role === Role.PSM));
  }

  onSubmit(): void {

    var allocationId = this.allocation.id;
    var fromRealToSale = this.allocation.realCommitment;
    if (allocationId != null) {
      if(!this.hasPermissions()) {
        this.allocationService.convert(allocationId, fromRealToSale).subscribe(() => {
          this.showSuccessMessage();
          this.dialogRef.close();
        }, error => {
          console.log(error);
        });
      } else {
        this.toastrService.error("User doesn't have permissions", "Error");
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

}
