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
    loadChildren: './modules/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: ':userName/:shareName',
    resolve: {
      status: LinkVerificationResolver
    },
    // component: PublicShareComponent
    loadChildren: './modules/public-share/public-share.module#PublicShareModule'
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
