import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScsRoutingModule } from './scs-routing.module';
import { ScsComponent } from './scs.component';
import { SharedModule } from '@shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [
    ScsComponent
  ],
  imports: [
    CommonModule,
    ScsRoutingModule,
    SharedModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatExpansionModule
  ]
})
export class ScsModule { }
