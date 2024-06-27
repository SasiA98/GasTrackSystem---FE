import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ProjectSearchComponent } from './components/project-search/project-search.component';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';

export interface BreadcrumbData {
  title: string;
  breadcrumb: RoutesEnum[];
}

const routes: Routes = [
  {
    path: '',
    component: ProjectSearchComponent,
    data: {
      permission: ROLE_VISIBILITY.PROJECTS,
    },
  },
  {
    path: RoutesEnum.NEW,
    canActivate: [PermissionGuard],
    data: {
      title: 'PROJECTS.FORM.TITLE',
      content: RoutesEnum.PROJECTS,
      permission: ROLE_VISIBILITY.NEW_PROJECT,
      breadcrumb: [RoutesEnum.NEW]
    },
    component: ProjectFormComponent
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: {
      title: 'PROJECTS.FORM.TITLE',
      content: RoutesEnum.PROJECTS,
      permission: ROLE_VISIBILITY.PROJECTS,
      breadcrumb: [RoutesEnum.DETAIL]
    },
    component: ProjectFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
