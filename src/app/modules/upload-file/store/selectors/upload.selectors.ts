import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store'
import { UploadState, UploadStatus } from '../../state'

export const selectUploadFileFeatureState: MemoizedSelector<object, UploadState> = createFeatureSelector<UploadState>('upload')

export const selectUploadFileError: MemoizedSelector<object, string> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): string => state.error
)

export const concatFileArrays = (state: any) => {
  let files = state.completedFiles.concat(state.pendingFiles)
  return files
}
  

export const selectProgressBarColor = (index: number) => createSelector(
  selectUploadFileFeatureState,
  (state: UploadState) => { 
    const files = concatFileArrays(state)
    const progressColor = files[index].progressColor
    return progressColor
  }
)

export const selectIndividualFileUploadState = (index: number) => createSelector(
  selectUploadFileFeatureState,
  (state: UploadState) => { 
    const files = concatFileArrays(state)
    const file = files[index]
    return file
  }
)


export const selectFileUploadSpeed = (index: number): MemoizedSelector<object, any> => createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): number => {
    return state.pendingFiles[index].uploadSpeed
  }
)

export const selectFileUploadProgress = (index: number): MemoizedSelector<object, any> => createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): number => {
    return state.pendingFiles[index].progress
  }
)

export const selectUploadFileReady: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): boolean => state.status === UploadStatus.Ready
)

export const selectUploadFileRequested: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): boolean => state.status === UploadStatus.Requested
)

export const selectUploadFileStarted: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): boolean => state.status === UploadStatus.Started
)

export const selectUploadFileProgress: MemoizedSelector<object, number> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): number => state.progress
)

export const selectUploadFileInProgress: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): boolean => state.status === UploadStatus.Started && state.progress >= 0
)

export const selectUploadFileFailed: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): boolean => state.status === UploadStatus.Failed
)

export const selectUploadFileCompleted: MemoizedSelector<object, boolean> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): boolean => {
    return state.status === UploadStatus.Completed
  }
)

export const selectUploadFileState: MemoizedSelector<object, any> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): any => {
    const files = concatFileArrays(state)
    return files
  }
)

export const selectUploadViewState: MemoizedSelector<object, any> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): any => {
    return state.viewState
  }
)

export const selectUploadState: MemoizedSelector<object, any> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): any => {
    const result = { ...state, files: concatFileArrays(state)}
    return result
  }
)

export const selectCurrentUploadState: MemoizedSelector<object, any> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState) => {
    return state
  }
)

export const selectIndividualFileUploadProgress: MemoizedSelector<object, any> = createSelector(
  selectUploadFileFeatureState,
  (state: UploadState): any => {
    return state.pendingFiles
  }
)