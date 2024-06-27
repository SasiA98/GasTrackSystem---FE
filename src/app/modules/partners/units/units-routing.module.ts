import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { UnitFormComponent } from './components/unit-form/unit-form.component';
import { UnitSearchComponent } from './components/unit-search/unit-search.component';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: UnitSearchComponent,
    data: {
      permission: ROLE_VISIBILITY.UNITS
    },
  },
  {
    path: RoutesEnum.NEW,
    canActivate: [PermissionGuard],
    data: {
      title: 'UNITS.FORM.TITLE',
      content: RoutesEnum.UNITS,
      permission: ROLE_VISIBILITY.NEW_UNIT,
      breadcrumb: [RoutesEnum.NEW]
    },
    component: UnitFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'UNITS.FORM.TITLE',
      content: RoutesEnum.UNITS,
      permission: ROLE_VISIBILITY.UNITS,
      breadcrumb: [RoutesEnum.DETAIL]
    },
    component: UnitFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitsRoutingModule { }
