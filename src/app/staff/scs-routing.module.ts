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
        loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule)
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
          },
          {
            path: RoutesEnum.USERS,
            loadChildren: () => import('../modules/partners/users/users.module').then((m) => m.UsersModule),
            data: {
              title: 'USERS.SEARCH.TITLE',
              breadcrumb: [ RoutesEnum.USERS]
            } as BreadcrumbData
          },
          {
            path: RoutesEnum.UNITS,
            loadChildren: () => import('../modules/partners/units/units.module').then((m) => m.UnitsModule),
            data: {
              title: 'UNITS.SEARCH.TITLE',
              breadcrumb: [RoutesEnum.UNITS]
            } as BreadcrumbData
          },
          {
            path: RoutesEnum.LISTS,
            loadChildren: () => import('../modules/partners/companies/companies.module').then((m) => m.CompaniesModule),
            data: {
              title: 'COMPANIES.SEARCH.TITLE',
              breadcrumb: [RoutesEnum.LISTS]
            } as BreadcrumbData
          },
          {
            path: RoutesEnum.PROJECTS,
            loadChildren: () => import('../modules/partners/projects/projects.module').then((m) => m.ProjectsModule),
            data: {
              title: 'PROJECTS.SEARCH.TITLE',
              breadcrumb: [RoutesEnum.PROJECTS]
            } as BreadcrumbData
          }
        ]
      },
      {
        path: RoutesEnum.LICENCES,
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
        path: RoutesEnum.TIMESHEET,
        children: [
          {
            path: RoutesEnum.RESOURCE_TIMESHEET,
            loadChildren: () => import('../modules/partners/timesheet/timesheet.module').then((m) => m.TimesheetModule),
            data: {
              title: 'TIMESHEET.FORM.TITLE',
              breadcrumb: [RoutesEnum.RESOURCE_TIMESHEET]
            } as BreadcrumbData
          },
          {
            path: RoutesEnum.UNIT_TIMESHEET,
            loadChildren: () => import('../modules/partners/unit-timesheet/unit-timesheet.module').then((m) => m.UnitTimesheetModule),
            data: {
              title: 'UNIT_TIMESHEET.FORM.TITLE',
              breadcrumb: [RoutesEnum.UNIT_TIMESHEET]
            } as BreadcrumbData
          }
        ]
      },
      {
        path: RoutesEnum.GANTT,
        children: [
          {
            path: RoutesEnum.RESOURCE_GANT_OVERVIEW,
            loadChildren: () => import('../modules/partners/resource-load-overview/resource-overview.module').then((m) => m.ResourceOverviewModule),
            data: {
              title: 'RESOURCE_LOAD_OVERVIEW.FORM.TITLE',
              breadcrumb: [RoutesEnum.RESOURCE_GANT_OVERVIEW]
            } as BreadcrumbData
          },
             {
                      path: RoutesEnum.PROJECTS_GANT_OVERVIEW,
                      data: {
                        title: 'PROJECTS_GANT_OVERVIEW.FORM.TITLE',
                        content: RoutesEnum.PROJECTS_GANT_OVERVIEW,
                        breadcrumb: [RoutesEnum.PROJECTS_GANT_OVERVIEW]
                      } as BreadcrumbData,
                      loadChildren: () =>
                        import('../modules/partners/resource-load-overview/project-overview.module').then((m) => m.ProjectOverviewModule)
                    }
        ]
      },
      {
        path: RoutesEnum.SKILLS_OVERVIEW,
        children: [
          {
            path: RoutesEnum.SKILLS,
            loadChildren: () => import('../modules/partners/skills/skills.module').then((m) => m.SkillsModule),
            data: {
              title: 'SKILLS.FORM.TITLE',
              breadcrumb: [RoutesEnum.SKILLS]
            } as BreadcrumbData
          }
        ]
      },
      /*
      {
        path: RoutesEnum.IMPORT_OVERVIEW,
        children: [
          {
            path: RoutesEnum.IMPORT,
            loadChildren: () => import('../modules/partners/import-excel/import.module').then((m) => m.ImportModule),
            data: {
              title: 'IMPORT.FORM.TITLE',
              breadcrumb: [RoutesEnum.IMPORT]
            } as BreadcrumbData
          },
          {
            path: RoutesEnum.IMPORT_RESOURCES,
            loadChildren: () => import('../modules/partners/import-excel/import-resources.module').then((m) => m.ImportResourcesModule),
          data: {
            title: 'IMPORT.FORM.TITLE',
            breadcrumb : [RoutesEnum.IMPORT_RESOURCES]
          } as BreadcrumbData      
         }
        ]
      },
      */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScsRoutingModule { }
