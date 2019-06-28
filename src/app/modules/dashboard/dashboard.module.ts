import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { DashboardRouter } from './dashboard.router.module';
import { SharedModule } from '@/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { fileSystemReducer } from './store/reducer/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FileSystemEffects } from './store/effects/filesystem.effects';

@NgModule({
    declarations: [
        DashboardComponent,
        MainComponent,
        RepositoryComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DashboardRouter,
        StoreModule.forFeature('fs', fileSystemReducer),
        EffectsModule.forFeature([FileSystemEffects]),
    ],
    exports: [],
    providers: [],
})
export class DashboardModule {}