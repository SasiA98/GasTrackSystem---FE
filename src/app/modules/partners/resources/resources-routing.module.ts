import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { ResourceFormComponent } from './components/resource-form/resource-form.component';
import { ResourceSearchComponent } from './components/resource-search/resource-search.component';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: ResourceSearchComponent,
    data: {
      permission: ROLE_VISIBILITY.RESOURCES
    },
  },
   {
      path: RoutesEnum.NEW,
      canActivate: [PermissionGuard],
      data: {
        title: 'RESOURCES.FORM.TITLE',
        content: RoutesEnum.RESOURCES,
        permission: ROLE_VISIBILITY.NEW_RESOURCE,
        breadcrumb: [RoutesEnum.NEW]

      },
      component: ResourceFormComponent
    },

    {
      path: ':id',
      canActivate: [PermissionGuard],
      data: {
        title: 'RESOURCES.FORM.TITLE',
        content: RoutesEnum.RESOURCES,
        permission: ROLE_VISIBILITY.RESOURCES,
        breadcrumb: [RoutesEnum.DETAIL]
      },
      component: ResourceFormComponent
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule { }
