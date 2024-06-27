import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { ResourceOverviewFormComponent } from './components/resource-overview-form/resource-overview-form.component';


const routes: Routes = [
  {
    path: '',
    component: ResourceOverviewFormComponent,
    data: {
      permission: ROLE_VISIBILITY.UNITS
    },
  },
  {
    path: RoutesEnum.GANTT,
    canActivate: [PermissionGuard],
    data: {
      title: 'RESOURCE_LOAD_OVERVIEW.FORM.TITLE',
      content: RoutesEnum.GANTT,
      permission: ROLE_VISIBILITY.UNITS
    },
    component: ResourceOverviewFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'RESOURCE_LOAD_OVERVIEW.FORM.TITLE',
      content: RoutesEnum.GANTT,
      permission: ROLE_VISIBILITY.UNITS
    },
    component: ResourceOverviewFormComponent
  }
];


@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceOverviewRoutingModule { }
