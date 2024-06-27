import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { ScsComponent } from './scs.component';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { title } from 'process';

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
        path: RoutesEnum.MANAGEMENT,
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
            path: RoutesEnum.RESOURCES,
            loadChildren: () => import('../modules/partners/resources/resources.module').then((m) => m.ResourcesModule),
            data: {
              title: 'RESOURCES.SEARCH.TITLE',
              breadcrumb: [RoutesEnum.RESOURCES]
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
        path: RoutesEnum.OFFICIAL_TRIGRAMS,
        children: [
          {
            path: RoutesEnum.OPERATIONS_TRIGRAMS,
            loadChildren: () => import('../modules/partners/official-trigrams/official-trigrams.module').then((m) => m.OfficialTrigramsModule),
            data: {
              title: 'OFFICIAL_TRIGRAMS.SEARCH.TITLE',
              breadcrumb: [RoutesEnum.OPERATIONS_TRIGRAMS]
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScsRoutingModule { }
