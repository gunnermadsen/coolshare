import { NgModule } from '@angular/core';
import { SharedModule } from '@/shared/shared.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { PublicShareComponent } from './components/public-share/public-share.component';
import { PublicShareRoutingModule } from './public-share.router.module';

@NgModule({
    declarations: [
        PublicShareComponent
    ],
    imports: [
        SharedModule,
        PublicShareRoutingModule,
        DashboardModule,
    ],
    exports: [],
    providers: [],
})
export class PublicShareModule {}