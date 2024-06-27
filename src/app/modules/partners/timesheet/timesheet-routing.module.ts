import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { TimesheetFormComponent } from './components/timesheet-form/timesheet-form.component';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: TimesheetFormComponent,
    data: {
      permission: ROLE_VISIBILITY.TIMESHEETS
    },
  },
  {
    path: RoutesEnum.NEW,
    canActivate: [PermissionGuard],
    data: {
      title: 'TIMESHEET.FORM.TITLE',
      content: RoutesEnum.TIMESHEET,
      permission: ROLE_VISIBILITY.NEW_UNIT
    },
    component: TimesheetFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'TIMESHEET.FORM.TITLE',
      content: RoutesEnum.TIMESHEET,
      permission: ROLE_VISIBILITY.TIMESHEETS
    },
    component: TimesheetFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }
