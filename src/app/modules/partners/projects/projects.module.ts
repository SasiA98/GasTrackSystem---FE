import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectSearchComponent } from './components/project-search/project-search.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ProjectFilterComponent } from 'src/app/modules/partners/projects/components/project-filter/project-filter.component';
import { ProjectAllocationDialogComponent } from './components/project-allocation-dialog/project-allocation-dialog.component';
import { ConvertAllocationDialogComponent } from './components/convert-allocation-dialog/convert-allocation-dialog.component'

@NgModule({
  declarations: [ProjectSearchComponent, ProjectFilterComponent, ProjectFormComponent, ProjectAllocationDialogComponent, ConvertAllocationDialogComponent],
  imports: [CommonModule, ProjectsRoutingModule, SharedModule]
})
export class ProjectsModule {}
