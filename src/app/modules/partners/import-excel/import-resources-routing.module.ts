import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { ImportFormComponent } from './components/import-timesheet/import-excel-form.component';
import { ImportResourcesFormComponent } from './components/import-resources/import-resources-form.component';


const routes: Routes = [
  {
    path: '',
    component: ImportResourcesFormComponent,
    data: {
      permission: ROLE_VISIBILITY.IMPORT_RESOURCES
    },
  },
  {
    path: RoutesEnum.IMPORT,
    canActivate: [PermissionGuard],
    data: {
      title: 'RESOURCE_LOAD_OVERVIEW.FORM.TITLE',
      content: RoutesEnum.IMPORT_RESOURCES,
      permission: ROLE_VISIBILITY.IMPORT_RESOURCES
    },
    component: ImportResourcesFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'RESOURCE_LOAD_OVERVIEW.FORM.TITLE',
      content: RoutesEnum.IMPORT_RESOURCES,
      permission: ROLE_VISIBILITY.IMPORT_RESOURCES
    },
    component: ImportResourcesFormComponent
  }
];


@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportResourcesRoutingModule { }
