import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserSearchComponent } from './components/search/user-search.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserFilterComponent } from './components/user-filter/user-filter.component';

@NgModule({
  declarations: [UserSearchComponent, UserFilterComponent, UserFormComponent],
  imports: [CommonModule, UsersRoutingModule, SharedModule]
})
export class UsersModule {}
