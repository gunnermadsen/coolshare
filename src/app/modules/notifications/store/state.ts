export enum NotificationTypes {
    Upload = 'Upload',
    DeleteFile = 'Delete File',
    DeleteFiles = 'Delete Files',
    CreateNewFolder = 'Create New Folder',
    CreateNewSharedFolder = 'Create New Shared Folder',
    AccountModified = 'Account Modified',
    FileDownloaded = 'Download',
    AddToFavorites = 'Is Favorite',
    RenameEntity = 'Rename Entity',
    Empty = 'Empty',
    Default = 'Default'
}


export interface NotificationSettingsState {
    notificationBadgeHidden: boolean | null;
}

export interface INotificationState {
    id: string
    type: NotificationTypes
    title: String
    options: any
    createdOn: Date
}

export const initialNotificationSettingsState: NotificationSettingsState = {
    notificationBadgeHidden: null
};