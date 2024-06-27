import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UnitTimesheetRoutingModule } from './unit-timesheet-routing.module';
import { UnitTimesheetFormComponent } from './components/timesheet-form/unit-timesheet-form.component';


@NgModule({
  declarations: [UnitTimesheetFormComponent],
  imports: [CommonModule, UnitTimesheetRoutingModule, SharedModule]
})
export class UnitTimesheetModule {

}

