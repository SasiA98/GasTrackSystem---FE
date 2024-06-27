import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { AuthSubformComponent } from './components/auth-subform/auth-subform.component';
import { AuthSubformResetPwComponent } from './components/auth-subform-reset-pw/auth-subform-reset-pw.component';
import { AuthSubformTokenComponent } from './components/auth-subform-token/auth-subform-token.component';
import { AccessDeniedComponent } from './components/access-denied-page/access-denied-page.component';

@NgModule({
  declarations: [
    AuthSubformComponent,
    AuthPageComponent,
    AuthSubformResetPwComponent,
    AuthSubformTokenComponent,
    AccessDeniedComponent
  ],
  imports: [CommonModule, SharedModule, AuthRoutingModule]
})
export class AuthModule {}
