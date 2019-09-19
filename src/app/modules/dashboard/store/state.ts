export interface FileSystemSettingsState {
    isEmpty: boolean | null,
    cwd: string | null
}

export const initialFileSystemSettingsState: FileSystemSettingsState = {
    isEmpty: null,
    cwd: null
}