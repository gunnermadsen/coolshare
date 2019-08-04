import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './pages/account/account.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
    { 
        path: '', 
        component: AccountComponent,
        children: [
            {
                path: '',
                component: ProfileComponent
            }
        ],
    },
    {
        path: '**',
        redirectTo: '/dashboard/main'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {}
