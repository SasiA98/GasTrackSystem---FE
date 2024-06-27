import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectOverviewFormComponent } from './components/project-overview-form/project-overview-form.component';
import { ProjectOverviewRoutingModule } from './project-overview-routing.module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [ProjectOverviewFormComponent],
  imports: [
    CommonModule, ProjectOverviewRoutingModule, SharedModule, FormsModule, CdkTableModule, MatProgressSpinnerModule, MatTooltipModule, MatPaginatorModule,
    MatTableModule
  ]
})
export class ProjectOverviewModule { }
