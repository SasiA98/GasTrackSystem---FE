import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserStatusRoutingModule } from './user-status-routing.module';
import { SharedModule } from '@shared/shared.module';
import { UserStatusComponent } from './components/user-status/user-status.component';


@NgModule({
  declarations: [
    UserStatusComponent
  ],
  imports: [
    CommonModule,
    UserStatusRoutingModule,
    SharedModule
  ]
})
export class UserStatusModule { }
