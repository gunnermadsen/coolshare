export enum UploadStatus {
  Ready = 'Ready',
  Requested = 'Requested',
  Started = 'Started',
  Failed = 'Failed',
  Completed = 'Completed'
}

export interface State {
  status: UploadStatus;
  error: string | null;
  progress: number | null;
  files?: any;
  viewState: boolean | null;
}

export const initialState: State = {
  status: UploadStatus.Ready,
  error: null,
  progress: null,
  files: null,
  viewState: null
};