import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { CompanySearchComponent } from './components/company-search/company-search.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { RoutesEnum } from 'src/app/core/routes.enum';



const routes: Routes = [
  {
    path: '',
    component: CompanySearchComponent,
    data: {
      permission: ROLE_VISIBILITY.EVERYBODY
    },
  },
  {
    path: RoutesEnum.NEW,
    canActivate: [PermissionGuard],
    data: {
      title: 'COMPANIES.FORM.TITLE',
      content: RoutesEnum.COMPANIES,
      permission: ROLE_VISIBILITY.EVERYBODY,
      breadcrumb: [RoutesEnum.NEW]
    },
    component: CompanyFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'COMPANIES.FORM.TITLE',
      content: RoutesEnum.COMPANIES,
      permission: ROLE_VISIBILITY.EVERYBODY,
      breadcrumb: [RoutesEnum.DETAIL]
    },
    component: CompanyFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
