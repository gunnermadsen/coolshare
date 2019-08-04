import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { State, UploadStatus } from '../../state';

export const selectUploadFileFeatureState: MemoizedSelector<object, State> = createFeatureSelector<State>('upload');

export const selectUploadFileError: MemoizedSelector<object, string> = createSelector(
  selectUploadFileFeatureState,
  (state: State): string => state.error
);

export const selectUploadFileReady: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: State): boolean => state.status === UploadStatus.Ready
);

export const selectUploadFileRequested: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: State): boolean => state.status === UploadStatus.Requested
);

export const selectUploadFileStarted: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: State): boolean => state.status === UploadStatus.Started
);

export const selectUploadFileProgress: MemoizedSelector<object, number> = createSelector(
  selectUploadFileFeatureState,
  (state: State): number => state.progress
);

export const selectUploadFileInProgress: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: State): boolean => state.status === UploadStatus.Started && state.progress >= 0
);

export const selectUploadFileFailed: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: State): boolean => state.status === UploadStatus.Failed
);

export const selectUploadFileCompleted: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: State): boolean => {
    return state.status === UploadStatus.Completed;
  }
);


export const selectUploadFileState: MemoizedSelector<object, any> = createSelector(
  selectUploadFileFeatureState,
  (state: State): any => {
    const files = Object.values(state.files);
    return files;
  }
)

export const selectUploadViewState: MemoizedSelector<object, any> = createSelector(
  selectUploadFileFeatureState,
  (state: State): any => state.viewState
)

export const selectUploadState: MemoizedSelector<object, any> = createSelector(
  selectUploadFileFeatureState,
  (state: State): any => {
    return state;
  }
)

export const selectIndividualFileUploadProgress: MemoizedSelector<object, any> = createSelector(
  selectUploadFileFeatureState,
  (state: State): any => {
    return state.files
  }
)