import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportResourcesFormComponent } from './components/import-resources/import-resources-form.component';
import { ImportResourcesRoutingModule } from './import-resources-routing.module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [ImportResourcesFormComponent],
  imports: [CommonModule, ImportResourcesRoutingModule, SharedModule, FormsModule, CdkTableModule, MatTooltipModule]
})
export class ImportResourcesModule { }
