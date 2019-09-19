import { FileSystemSettingsActionTypes, FileSystemSettingsActions } from '../actions/settings.actions';
import { initialFileSystemSettingsState, FileSystemSettingsState } from '../state';

export function FileSystemSettingsReducer(state = initialFileSystemSettingsState, action: FileSystemSettingsActions): FileSystemSettingsState {
    switch (action.type) {
        case FileSystemSettingsActionTypes.SAVE_SETTINGS: {
            return {
                ...action.payload.settings
            }
        }

        default: {
            return state;
        }
    }
}