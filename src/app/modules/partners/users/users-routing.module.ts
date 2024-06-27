import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { UserSearchComponent } from './components/search/user-search.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';

const routes: Routes = [
  {
    path: '',
    component: UserSearchComponent,
    data: {
      permission: ROLE_VISIBILITY.USERS
    },
  },
  {
    path: RoutesEnum.NEW,
    canActivate: [PermissionGuard],
    data: {
      title: 'USERS.FORM.TITLE',
      content: RoutesEnum.USERS,
      permission: ROLE_VISIBILITY.NEW_USER,
      breadcrumb: [RoutesEnum.NEW]
    },
    component: UserFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'USERS.FORM.TITLE',
      content: RoutesEnum.USERS,
      permission: ROLE_VISIBILITY.USERS,
      breadcrumb: [RoutesEnum.DETAIL]
    },
    component: UserFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
