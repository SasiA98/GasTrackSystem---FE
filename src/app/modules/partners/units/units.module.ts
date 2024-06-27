import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UnitsRoutingModule } from './units-routing.module';
import { UnitSearchComponent } from './components/unit-search/unit-search.component';
import { UnitFormComponent } from './components/unit-form/unit-form.component';

@NgModule({
  declarations: [UnitSearchComponent, UnitFormComponent],
  imports: [CommonModule, UnitsRoutingModule, SharedModule]
})
export class UnitsModule {}
