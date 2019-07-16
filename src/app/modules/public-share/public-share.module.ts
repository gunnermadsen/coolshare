import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@/shared/shared.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { PublicShareComponent } from './components/public-share/public-share.component';
import { PublicShareRoutingModule } from './public-share.router.module';

@NgModule({
    declarations: [
        PublicShareComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        PublicShareRoutingModule,
        DashboardModule,
    ],
    exports: [],
    providers: [],
})
export class PublicShareModule {}