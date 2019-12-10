import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { RepositoryComponent } from './components/repository/repository.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        
        children: [
            {
                path: 'main',
                component: MainComponent
            },
            {
                path: 'files',
                component: RepositoryComponent
            },
            {
                path: '**',
                redirectTo: 'files'
            }
        ]
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRouter {}
