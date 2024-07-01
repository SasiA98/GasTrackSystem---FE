import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROLE_VISIBILITY } from '@shared/constants/role-visibility.constants';
import { CompanyLicencesSearchComponent as CompanyLicencesSearchComponent } from './components/company-licences-search/company-licences.component';


const routes: Routes = [
  {
    path: '',
    component: CompanyLicencesSearchComponent,
    data: {
      permission: ROLE_VISIBILITY.EVERYBODY
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyLicencesRoutingModule { }
