import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LicencesRoutingModule } from './licences-routing.module';
import { LicenceSearchComponent } from './components/licence-search/licence-search.component';
import { LicenceFormComponent } from './components/licence-form/licence-form.component';

@NgModule({
  declarations: [LicenceSearchComponent, LicenceFormComponent],
  imports: [CommonModule, LicencesRoutingModule, SharedModule]
})
export class LicencesModule {}
