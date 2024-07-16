import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { LicenceFormComponent } from './components/licence-form/licence-form.component';
import { LicenceSearchComponent } from './components/licence-search/licence-search.component';



const routes: Routes = [
  {
    path: '',
    component: LicenceSearchComponent,
    data: {
      permission: ROLE_VISIBILITY.EVERYBODY
    },
  },
  {
    path: RoutesEnum.NEW,
    canActivate: [PermissionGuard],
    data: {
      title: 'LICENCES.FORM.TITLE',
      content: RoutesEnum.LICENCES,
      permission: ROLE_VISIBILITY.EVERYBODY,
      breadcrumb: [RoutesEnum.NEW]
    },
    component: LicenceFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'LICENCES.FORM.TITLE',
      content: RoutesEnum.LICENCES,
      permission: ROLE_VISIBILITY.EVERYBODY,
      breadcrumb: [RoutesEnum.DETAIL]
    },
    component: LicenceFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicencesRoutingModule { }
