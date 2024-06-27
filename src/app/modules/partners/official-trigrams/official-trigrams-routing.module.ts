import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from 'src/app/core/routes.enum';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { OfficialTrigramsComponent } from './components/official-trigrams-search/official-trigrams.component';


const routes: Routes = [
  {
    path: '',
    component: OfficialTrigramsComponent,
    data: {
      permission: ROLE_VISIBILITY.OFFICIAL_TRIGRAMS
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficialTrigramsRoutingModule { }
