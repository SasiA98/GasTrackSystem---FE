import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RolePermissionService } from '@shared/services/role-permission.service';
import { Role } from '@shared/enums/role.enum';
import { ToastrService } from 'ngx-toastr';
import { TimesheetProject } from '@shared/models/timesheet-project.model';
import { TimesheetProjectService } from '@shared/services/timesheet-project.service';

@Component({
  selector: 'app-timesheet-delete-dialog',
  templateUrl: './timesheet-delete-dialog.component.html',
  styleUrls: ['./timesheet-delete-dialog.component.scss']
})
export class TimesheetDeleteDialogComponent {

  //GDM e / o DUM.

  constructor(
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService,
    private readonly timesheetProjectService: TimesheetProjectService,
    public dialogRef: MatDialogRef<TimesheetDeleteDialogComponent>,
    private readonly roleService: RolePermissionService,
    @Inject(MAT_DIALOG_DATA) public timesheetProject: TimesheetProject) {

  }

  hasPermissions(): boolean {
    var roles = this.roleService.getUserRole();
    return !(roles.every(role => role === Role.GDM || role === Role.DUM || role === Role.ADMIN));
  }


  onSubmit(): void {

    var timesheet_id = this.timesheetProject.id;

    if (timesheet_id != null) {
      if(!this.hasPermissions()) {
        this.timesheetProjectService.delete(timesheet_id).subscribe(() => {
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
