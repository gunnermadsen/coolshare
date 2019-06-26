import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/home/components/login/login.component';

import { RegisterComponent } from './modules/home/components/register/register.component';
import { AuthGuardService } from './core/guards/auth.guard';

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
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
