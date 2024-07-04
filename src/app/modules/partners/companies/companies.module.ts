import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompanySearchComponent } from './components/company-search/company-search.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';

@NgModule({
  declarations: [CompanySearchComponent, CompanyFormComponent],
  imports: [CommonModule, CompaniesRoutingModule, SharedModule]
})
export class CompaniesModule {}
