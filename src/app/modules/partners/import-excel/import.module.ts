import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportRoutingModule } from './import-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { ImportFormComponent } from './components/import-timesheet/import-excel-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [ImportFormComponent],
  imports: [CommonModule, ImportRoutingModule, SharedModule, FormsModule, CdkTableModule, MatTooltipModule]
})
export class ImportModule {


}
