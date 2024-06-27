import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Allocation } from '@shared/models/allocation.model';
import { AllocationService } from '@shared/services/allocation.service';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { Role } from '@shared/enums/role.enum';
import { ToastrService } from 'ngx-toastr';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';

@Component({
  selector: 'app-project-delete-dialog',
  templateUrl: './project-delete-dialog.component.html',
  styleUrls: ['./project-delete-dialog.component.scss']
})
export class ProjectDeleteDialogComponent {

  //GDM e / o DUM.

  constructor(
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
    private readonly allocationService: AllocationService,
    public dialogRef: MatDialogRef<ProjectDeleteDialogComponent>,
    private readonly roleService: RolePermissionService,
    @Inject(MAT_DIALOG_DATA) public allocation: Allocation) {

  }



  onSubmit(): void {

    var allocationId = this.allocation.id;

    if (allocationId != null) {
      const permission = this.roleService.hasPermission(ROLE_VISIBILITY.ALLOCATIONS)
      if(permission === true) {
        this.allocationService.delete(allocationId).subscribe(() => {
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
