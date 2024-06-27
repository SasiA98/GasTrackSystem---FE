import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OfficialTrigramsRoutingModule } from './official-trigrams-routing.module';
import { OfficialTrigramsComponent } from './components/official-trigrams-search/official-trigrams.component';
import { OfficialTrigramCreationDialogComponent } from './components/official-trigrams-creation-dialog/official-trigrams-creation-dialog.component';
import { OfficialTrigramDeleteDialogComponent } from './components/official-trigrams-delete-dialog/official-trigrams-delete-dialog.component';

@NgModule({
  declarations: [OfficialTrigramsComponent, OfficialTrigramCreationDialogComponent, OfficialTrigramDeleteDialogComponent],
  imports: [CommonModule, OfficialTrigramsRoutingModule, SharedModule]
})
export class OfficialTrigramsModule {}
