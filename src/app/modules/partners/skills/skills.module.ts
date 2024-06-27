import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SkillsSearchComponent } from './components/skills-search/skills-search.component';
import { SkillsRoutingModule } from './skills-routing.module';
import { SkillGroupCreationDialogComponent } from './components/skill-group-creation-dialog/skill-group-creation-dialog.component';
import { SkillCreationDialogComponent } from './components/skill-creation-dialog/skill-creation-dialog.component';
import { SkillGroupDeleteDialogComponent } from './components/skill-group-delete-dialog/skill-group-delete-dialog.component';
import { SkillDeleteDialogComponent } from './components/skill-delete-dialog/skill-delete-dialog.component';

@NgModule({
  declarations: [SkillsSearchComponent, SkillGroupCreationDialogComponent, SkillDeleteDialogComponent, SkillGroupDeleteDialogComponent, SkillCreationDialogComponent],
  imports: [CommonModule, SkillsRoutingModule, SharedModule]
})
export class SkillsModule {}
