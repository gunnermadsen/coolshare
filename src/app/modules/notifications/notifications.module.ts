import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationEffects } from './store/effects/notification.effects';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { notificationReducer } from './store/reducer/notification.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '@/shared/shared.module';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { notificationSettingsReducer } from './store/reducer/settings.reducer';
import { UploadModule } from '../upload-file/upload.module';

export const NotificationReducersMap: ActionReducerMap<any> = {
    Events: notificationReducer,
    Settings: notificationSettingsReducer
};


@NgModule({
    declarations: [
        NotificationsComponent
    ],
    imports: [ 
        CommonModule,
        SharedModule,

        UploadModule,

        
        StoreModule.forFeature('Notifications', NotificationReducersMap),
        EffectsModule.forFeature([NotificationEffects]), 
    ],
    exports: [
        NotificationsComponent
    ],
    providers: [],
})
export class NotificationsModule {}