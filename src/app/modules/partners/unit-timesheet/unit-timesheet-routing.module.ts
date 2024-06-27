import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { UnitTimesheetFormComponent } from './components/timesheet-form/unit-timesheet-form.component';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: UnitTimesheetFormComponent,
    data: {
      permission: ROLE_VISIBILITY.TIMESHEETS
    },
  },
  {
    path: RoutesEnum.NEW,
    canActivate: [PermissionGuard],
    data: {
      title: 'UNIT_TIMESHEET.FORM.TITLE',
      content: RoutesEnum.UNIT_TIMESHEET,
      permission: ROLE_VISIBILITY.NEW_TIMESHEET
    },
    component: UnitTimesheetFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'UNIT_TIMESHEET.FORM.TITLE',
      content: RoutesEnum.UNIT_TIMESHEET,
      permission: ROLE_VISIBILITY.TIMESHEETS
    },
    component: UnitTimesheetFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitTimesheetRoutingModule { }
