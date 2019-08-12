import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationEffects } from './store/effects/notification.effects';
import { StoreModule } from '@ngrx/store';
import { notificationReducer } from './store/reducer/notification.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '@/shared/shared.module';
import { UploadModule } from '../upload-file/upload.module';
import { NotificationsComponent } from './pages/notifications/notifications.component';

@NgModule({
    declarations: [
        NotificationsComponent
    ],
    imports: [ 
        CommonModule,
        SharedModule,
        
        StoreModule.forFeature('notifications', notificationReducer),
        EffectsModule.forFeature([NotificationEffects]), 
    ],
    exports: [
        NotificationsComponent
    ],
    providers: [],
})
export class NotificationsModule {}