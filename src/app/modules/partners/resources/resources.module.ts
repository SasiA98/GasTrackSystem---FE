import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourceSearchComponent } from './components/resource-search/resource-search.component';
import { ResourceFormComponent } from './components/resource-form/resource-form.component';
import { ResourceFilterComponent } from './components/resource-filter/resource-filter.component';
import { ResourceHourlyCostDialogComponent } from './components/resource-hourly-cost-dialog/resource-hourly-cost-dialog.component';
import { ResourceSalaryDetailsDialogComponent } from './components/resource-salary-details-dialog/resource-salary-details-dialog.component';
import { ResourceSkillDialogComponent } from './components/resource-skill-dialog/resource-skill-dialog.component';

@NgModule({
  declarations: [
    ResourceSearchComponent,
    ResourceFormComponent,
    ResourceFilterComponent,
    ResourceHourlyCostDialogComponent,
    ResourceSalaryDetailsDialogComponent,
    ResourceSkillDialogComponent
  ],
  imports: [CommonModule, ResourcesRoutingModule, SharedModule]
})
export class ResourcesModule {}
