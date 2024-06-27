import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceOverviewRoutingModule } from './resource-overview-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ResourceOverviewFormComponent } from './components/resource-overview-form/resource-overview-form.component';
import { FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [ResourceOverviewFormComponent],
  imports: [CommonModule,ResourceOverviewRoutingModule, SharedModule, MatProgressSpinnerModule, FormsModule, CdkTableModule,  MatPaginatorModule,
    MatTableModule,]
})
export class ResourceOverviewModule {


}
