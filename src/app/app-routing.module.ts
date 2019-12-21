import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/home/components/login/login.component';

import { RegisterComponent } from './modules/home/components/register/register.component';
import { AuthGuardService } from './core/guards/auth.guard';
import { LinkVerificationResolver } from './core/guards/verify-link.guard';
import { PublicShareComponent } from './modules/public-share/components/public-share/public-share.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(mod => mod.DashboardModule)
  },
  {
    path: ':userName/:shareName',
    resolve: {
      result: LinkVerificationResolver
    },
    loadChildren: () => import('./modules/public-share/public-share.module').then(mod => mod.PublicShareModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./modules/account/account.module').then(mod => mod.AccountModule),
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    LinkVerificationResolver
  ]
})
export class AppRoutingModule { }
