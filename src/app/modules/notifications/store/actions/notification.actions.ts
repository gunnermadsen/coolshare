import { createAction, props } from '@ngrx/store';
import { NotificationTypes } from '../state';

export const createNewNotification = createAction('[Notifications API] Create Notification From Event', props<{ id: string, notificationType: NotificationTypes, createdOn: Date, title: string, userId: string, options?: any }>())
export const fetchNotifications = createAction('[Get Notifications API] Get Notifications', props<{ id: string }>())
export const saveNotifications = createAction('[Notifications Client] Save Retrieved Notifications', props<{ notifications: any }>())
export const deleteAllNotifications = createAction('[Notifications API] Delete All Notifications', props<{ id: string }>())