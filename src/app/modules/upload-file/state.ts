export enum UploadStatus {
  Ready = 'Ready',
  Ongoing = 'Ongoing',
  Requested = 'Requested',
  Started = 'Started',
  Failed = 'Failed',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Paused = 'Paused'
}

export interface FileState {
  progress: number
  progressColor: string
  file: File
  loaded: number
  completed: boolean
  status: UploadStatus
  uploadSpeed: number
  isPaused: boolean
}

export interface UploadState {
  completedFiles: FileState[] | null
  currentFile: number
  error: string | null
  files: FileState[]
  pendingFiles: FileState[] | null
  progress: number | null
  progressColor: string | null
  status: UploadStatus
  viewState: boolean | null
}

export const initialState: UploadState = {
  completedFiles: null,
  currentFile: null,
  error: null,
  files: null,
  pendingFiles: null,
  progress: null,
  progressColor: null,
  status: UploadStatus.Ready,
  viewState: null,
}

export interface UploadEventState {
  type: number
  loaded: number
  total: number
}

export interface UpdatedUploadState {
  content: UploadState
  event: UploadEventState
}