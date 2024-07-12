import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CompanyLicencesRoutingModule } from './company-licences-routing.module';
import { CompanyLicencesSearchComponent } from './components/company-licences-search/company-licences.component';
import { CompanyLicencesCreationDialogComponent } from './components/company-licences-creation-dialog/company-licences-creation-dialog.component';
import { CompanyLicencesSendEmailDialogComponent } from './components/company-licences-send-email-dialog/company-licences-send-email-dialog.component';

@NgModule({
  declarations: [CompanyLicencesSearchComponent, CompanyLicencesCreationDialogComponent, CompanyLicencesSendEmailDialogComponent],
  imports: [CommonModule, CompanyLicencesRoutingModule, SharedModule]
})
export class CompanyLicencesModule {}
