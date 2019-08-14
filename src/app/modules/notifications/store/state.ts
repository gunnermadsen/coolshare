export enum NotificationTypes {
    Upload = 'Upload',
    DeleteFile = 'Delete File',
    DeleteFiles = 'Delete Files',
    CreateNewFolder = 'Create New Folder',
    CreateNewSharedFolder = 'Create New Shared Folder',
    AccountModified = 'Account Modified',
    FileDownloaded = 'Download',
    Default = 'Default'
}


export interface NotificationSettingsState {
    notificationBadgeHidden: boolean | null;
}

export const initialNotificationSettingsState: NotificationSettingsState = {
    notificationBadgeHidden: null
};