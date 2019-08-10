export enum UploadStatus {
  Ready = 'Ready',
  Requested = 'Requested',
  Started = 'Started',
  Failed = 'Failed',
  Completed = 'Completed'
}

export interface FileState {
  
}

export interface State {
  status: UploadStatus;
  completedFiles: any[] | null;
  currentFile: number;
  error: string | null;
  progress: number | null;
  progressColor: string | null;
  pendingFiles: any[] | null;
  viewState: boolean | null;
}

export const initialState: State = {
  status: UploadStatus.Ready,
  currentFile: null,
  error: null,
  progress: null,
  progressColor: null,
  pendingFiles: null,
  completedFiles: null,
  viewState: null
};