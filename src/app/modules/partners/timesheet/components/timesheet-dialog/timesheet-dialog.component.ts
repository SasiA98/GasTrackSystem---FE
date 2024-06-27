import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Allocation } from '@shared/models/allocation.model';
import { Project } from '@shared/models/project.model';
import { TimesheetProject } from '@shared/models/timesheet-project.model';
import { Timesheet } from '@shared/models/timesheet.model';
import { ProjectService } from '@shared/services/project.service';
import { TimesheetProjectService } from '@shared/services/timesheet-project.service';

@Component({
  selector: 'app-timesheet-dialog',
  templateUrl: './timesheet-dialog.component.html',
  styleUrls: ['./timesheet-dialog.component.scss']
})
export class TimesheetDialogComponent {
  form: FormGroup;
  projects: Project[] = [];

  constructor(
    private readonly projectService: ProjectService,
    private readonly timesheetProjectService: TimesheetProjectService,
    public dialogRef: MatDialogRef<TimesheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { timesheet_id: number; timesheet_project: TimesheetProject }
  ) {
    this.projectService.getAll().subscribe((projects) => {
      this.projects = projects.filter((project) => project.status === 'In Progress' && project.name !== 'Time Off' && project.name !== 'Holidays');
    });
    this.form = this.createForm();
    if (this.data.timesheet_project) {
      this.form.patchValue(this.data.timesheet_project);
      this.form.get('project')?.get('id')?.setValue(this.data.timesheet_project.projectId);
      this.form.get('project')?.disable();
    }
  }

  private createForm(): FormGroup {
    return new FormGroup({
      project: new FormGroup({
        id: new FormControl('')
      }),
      hours: new FormControl('', [Validators.required, Validators.min(1)])
    });
  }

  saveTimesheetProject(): void {
    const { project, hours, preImportHours } = this.form.value;
    const project_submit = { id: project.id } as Project;
    const timesheet_submit = { id: this.data.timesheet_id } as Timesheet;

    const timesheetProject = this.setTimesheetProject(project_submit, timesheet_submit, hours, preImportHours, false);

    if(timesheetProject != undefined){
      this.timesheetProjectService.save(timesheetProject).subscribe(
        () => {
          this.dialogRef.close(timesheetProject);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  updateTimesheetProject(): void {
    const { hours } = this.form.value;
    const preImportHours = this.form.value;
    const project_submit = { id: this.data.timesheet_project.projectId } as Project;
    const timesheet_submit = { id: this.data.timesheet_id } as Timesheet;
    const allocation_submit = { id: this.data.timesheet_project.allocationId } as Allocation;

    const timesheetProject = this.setTimesheetProject(project_submit, timesheet_submit, hours, preImportHours, false, allocation_submit);

    if(timesheetProject != undefined){
      this.timesheetProjectService
        .update(this.data.timesheet_project.id!, timesheetProject)
        .subscribe(
          () => {
            this.dialogRef.close(timesheetProject);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

    //if allocation is present, tp will be updated, otherwise tp will be created
    setTimesheetProject(project: Project, timesheet: Timesheet, hours: number, preImportHours: number, verifiedHours: boolean, allocation?: Allocation, note?: string): TimesheetProject | undefined {
        
      if (project.id !== undefined && timesheet.id !== undefined) {
        let timesheetProject: TimesheetProject;
        
        if (!allocation || allocation.id === undefined) {
          timesheetProject = {
            timesheetId: timesheet.id,
            projectId: project.id,
            hours: hours,
            preImportHours: hours,
            verifiedHours: false,
            note: note
          };
        } else {
          timesheetProject = {
            timesheetId: timesheet.id,
            projectId: project.id,
            allocationId: allocation.id,
            hours: hours,
            preImportHours: hours,
            verifiedHours: false,
            note: note
          };
        }
    
        return timesheetProject;
      } else {
        return undefined;
      }
    }

  onSubmit(): void {
    if (this.data.timesheet_project && this.data.timesheet_project.id)
      this.updateTimesheetProject();
    else this.saveTimesheetProject();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
