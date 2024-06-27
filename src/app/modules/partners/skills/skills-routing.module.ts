import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { SkillsSearchComponent } from './components/skills-search/skills-search.component';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';


const routes: Routes = [
  {
    path: '',
    component: SkillsSearchComponent,
    data: {
      permission: ROLE_VISIBILITY.SKILLS
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule { }
