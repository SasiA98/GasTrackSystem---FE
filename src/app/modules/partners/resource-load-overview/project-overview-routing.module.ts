import { RouterModule, Routes } from "@angular/router";
import { ProjectOverviewFormComponent } from "./components/project-overview-form/project-overview-form.component";
import { ROLE_VISIBILITY } from "@shared/constants/role-visibility.constants";
import { NgModule } from "@angular/core";
import { PermissionGuard } from "@shared/guards/permission.guard";
import { RoutesEnum } from "src/app/core/routes.enum";
import { ResourceOverviewFormComponent } from "./components/resource-overview-form/resource-overview-form.component";

const routes: Routes = [
    {
      path: '',
      component: ProjectOverviewFormComponent,
      data: {
        permission: ROLE_VISIBILITY.UNITS
      },
    },
    {
      path: RoutesEnum.GANTT,
      canActivate: [PermissionGuard],
      data: {
        title: 'PROJECTS_GANT_OVERVIEW.FORM.TITLE',
        content: RoutesEnum.GANTT,
        permission: ROLE_VISIBILITY.UNITS
      },
      component: ProjectOverviewFormComponent
    },
    {
      path: ':id',
      canActivate: [PermissionGuard],
      data: {
        title: 'PROJECTS_GANT_OVERVIEW.FORM.TITLE',
        content: RoutesEnum.GANTT,
        permission: ROLE_VISIBILITY.UNITS
      },
      component: ProjectOverviewFormComponent
    }
  ];
  
  
  @NgModule({ 
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ProjectOverviewRoutingModule { }