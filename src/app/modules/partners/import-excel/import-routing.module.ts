import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { ImportFormComponent } from './components/import-timesheet/import-excel-form.component';


const routes: Routes = [
  {
    path: '',
    component: ImportFormComponent,
    data: {
      permission: ROLE_VISIBILITY.IMPORT
    },
  },
  {
    path: RoutesEnum.IMPORT,
    canActivate: [PermissionGuard],
    data: {
      title: 'RESOURCE_LOAD_OVERVIEW.FORM.TITLE',
      content: RoutesEnum.IMPORT,
      permission: ROLE_VISIBILITY.IMPORT
    },
    component: ImportFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'RESOURCE_LOAD_OVERVIEW.FORM.TITLE',
      content: RoutesEnum.IMPORT,
      permission: ROLE_VISIBILITY.IMPORT
    },
    component: ImportFormComponent
  }
];


@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportRoutingModule { }
