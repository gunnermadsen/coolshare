import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { DashboardRouter } from './dashboard.router.module';
import { SharedModule } from '@/shared/shared.module';

@NgModule({
    declarations: [
        DashboardComponent,
        MainComponent,
        RepositoryComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DashboardRouter
    ],
    exports: [],
    providers: [],
})
export class DashboardModule {}