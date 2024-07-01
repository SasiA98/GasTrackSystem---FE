import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './base/authentication/guards/auth.guard';
import { AccessDeniedComponent } from './modules/auth/components/access-denied-page/access-denied-page.component';

const routes: Routes = [
  {
    path: 'auth',
    data: { title: "Effettua l'accesso" },
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./staff/scs.module').then((m) => m.ScsModule)
  },
  { path: 'access-denied', component: AccessDeniedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}