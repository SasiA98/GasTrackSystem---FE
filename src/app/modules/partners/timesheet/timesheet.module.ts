import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetFormComponent } from './components/timesheet-form/timesheet-form.component';
import { TimesheetDialogComponent } from './components/timesheet-dialog/timesheet-dialog.component';


@NgModule({
  declarations: [TimesheetFormComponent, TimesheetDialogComponent],
  imports: [CommonModule, TimesheetRoutingModule, SharedModule]
})
export class TimesheetModule {

}

