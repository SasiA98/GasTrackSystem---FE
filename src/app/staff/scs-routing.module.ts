import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { ScsComponent } from './scs.component';

export interface BreadcrumbData {
  title: string;
  breadcrumb: RoutesEnum[];
}

const routes: Routes = [
  {
    path: '',
    component: ScsComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/partners/company-licences/company-licences.module').then((m) => m.CompanyLicencesModule),
        data: {
          title: 'COMPANY_LICENCES.SEARCH.TITLE',
          breadcrumb: [RoutesEnum.LISTS]
        } as BreadcrumbData
      },
      {
        path: RoutesEnum.PROFILE,
        loadChildren: () =>
          import('../modules/profile/profile.module').then((m) => m.ProfileModule),
        data: {
          title: 'USERS.SEARCH.TITLE',
          breadcrumb: [RoutesEnum.PROFILE]
        } as BreadcrumbData
      },
      {
        path: RoutesEnum.COMPANIES,
        children: [
          {
            path: '',
            redirectTo: RoutesEnum.PROFILE,
            pathMatch: 'full'
          }
        ]
      },
      {
        path: RoutesEnum.COMPANY_LICENCES,
        children: [
          {
            path: RoutesEnum.LISTS,
            loadChildren: () => import('../modules/partners/company-licences/company-licences.module').then((m) => m.CompanyLicencesModule),
            data: {
              title: 'COMPANY_LICENCES.SEARCH.TITLE',
              breadcrumb: [RoutesEnum.LISTS]
            } as BreadcrumbData
          }
        ]
      },
      {
        path: RoutesEnum.LICENCES,
        children: [
          {
            path: RoutesEnum.LISTS,
            loadChildren: () => import('../modules/partners/licences/licences.module').then((m) => m.LicencesModule),
            data: {
              title: 'LICENCES.SEARCH.TITLE',
              breadcrumb: [RoutesEnum.LISTS]
            } as BreadcrumbData
          }
        ]
      },
      {
        path: RoutesEnum.COMPANIES,
        children: [
          {
            path: RoutesEnum.LISTS,
            loadChildren: () => import('../modules/partners/companies/companies.module').then((m) => m.CompaniesModule),
            data: {
              title: 'COMPANIES.SEARCH.TITLE',
              breadcrumb: [RoutesEnum.LISTS]
            } as BreadcrumbData
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScsRoutingModule { }
