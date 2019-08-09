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
  currentFile: number;
  error: string | null;
  progress: number | null;
  progressColor: string | null;
  files: any[] | null;
  viewState: boolean | null;
}

export const initialState: State = {
  status: UploadStatus.Ready,
  currentFile: null,
  error: null,
  progress: null,
  progressColor: null,
  files: null,
  viewState: null
};