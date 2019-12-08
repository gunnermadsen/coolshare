import { Injectable } from '@angular/core'
import { HttpEventType, HttpEvent, HttpRequest } from '@angular/common/http'

import { Observable, of, forkJoin, EMPTY, NEVER, from, iif, defer } from 'rxjs'
import { takeUntil, map, catchError, tap, mergeMap, withLatestFrom, switchMap, materialize, dematerialize, exhaustMap, takeWhile, concatMap, skipUntil, sequenceEqual, last, shareReplay, switchMapTo } from 'rxjs/operators'

import { Action, Store, select } from '@ngrx/store'
import { Actions, ofType, createEffect } from '@ngrx/effects'

import serializeError from 'serialize-error'
import { HttpRepoService } from '@/core/http/repo.http.service'
import { AppState } from '@/reducers'

import { UploadActions, ActionTypes } from '../actions/upload.actions'
import { UploadStatus, FileState, UploadState, UpdatedUploadState, UploadEventState } from '../../state'
import { NotificationTypes } from '@/modules/notifications/store/state'
import { createNewNotification } from '@/modules/notifications/store/actions/notification.actions'

import * as filesystem from '@/modules/dashboard/store/actions/filesystem.actions'
import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts' 
import * as fromFileUploadActions from '../actions/upload.actions'

import * as _ from 'lodash'
import * as uuid from 'uuid'


@Injectable()
export class UploadEffects {

    private requests$: Observable<any>[]

    public uploadFile$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_REQUEST),
        tap((action: any) => this.generateNotification(action.payload)),
        mergeMap((action: any) => {      
            let total: number = 0
            let loaded: number = 0

            const timestamp: number = Date.now()
            
            const path: string = action.payload.path
            const userId: string = action.payload.userId
            const files: any[] = Object.values(action.payload.files)

            files.forEach((file: File) => total += file.size)

            this.requests$ = files.map((file: File, index: number) => {
                return this.repoService.uploadFile(file, path, index, userId).pipe(
                    // takeUntil(this.actions$.pipe(
                    //     ofType(fromFileUploadActions.ActionTypes.SINGLE_FILE_UPLOAD_CANCELLED)),
                    //     switchMapTo((action: any) => {
                    //         return action
                    //     })
                    // ),
                    withLatestFrom(this.store$.pipe(select(fromFileUploadSelectors.selectUploadState))),
                    tap(([mode, state]) => {
                        loaded = 0
                        state.pendingFiles.forEach((payload: any) => loaded += payload.loaded)
                        if (loaded >= total) {
                            this.updateFileProgress(index, state.pendingFiles, loaded, total, action)
                        }
                        return state
                    }),
                    map(([mode, state]) => this.getActionFromHttpEvent(mode, state, index, loaded, total, action, userId, timestamp)),
                    catchError((error: any) => of(this.handleError(error))),
                )
            })

            return forkJoin(this.requests$).pipe(
                map((action: any) => {
                    return { folder: path, id: userId, action: action }
                }),
                catchError((error: any) => of(this.handleError(error))),
            )
        }),
        // switchMap will cancel and replace the prior observable with a new value that came through
        exhaustMap((action: { action: any, folder: string, id: string }) => {
            return [
                new fromFileUploadActions.UploadCompletedAction(),
                filesystem.readEntityContents({ ...action })
            ]
        }),
        // takeUntil(this.actions$.pipe(ofType(fromFileUploadActions.ActionTypes.UPLOAD_COMPLETED))),
    ))

    // public cancelUpload$: Observable<void> = createEffect(() => this.actions$.pipe(
    //     ofType(fromFileUploadActions.ActionTypes.SINGLE_FILE_UPLOAD_CANCELLED),
    //     withLatestFrom(this.store$.pipe(select(fromFileUploadSelectors.selectCurrentUploadState))),
    //     // materialize(),
    //     tap((data: any) => {
    //         console.log(data)
    //         this.requests$.splice(data[0].payload.index, 1)
    //         // const uploadState = this.updateFileUploadState()
    //         // return of(this.requests$).pipe(
    //         //     map((requests: any) => {
    //         //         return requests
    //         //     })
    //         // )
    //         return EMPTY
    //     }),    
    // ), { dispatch: false })

    public setUploadPlayerState$: Observable<any> = createEffect(() => this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.SINGLE_FILE_UPLOAD_PAUSED),
        withLatestFrom(this.store$.pipe(select(fromFileUploadSelectors.selectCurrentUploadState))),
        switchMap((action: any) => {
            const index = action[0].payload.index

            // this.requests$[index]
            
            if (!action[1].pendingFiles[index].isPaused) {
                return EMPTY
            }
            else {
                return of(this.requests$).pipe(materialize())
            }
        }),
        dematerialize()
    ), { dispatch: false })

    constructor(private repoService: HttpRepoService, private actions$: Actions<fromFileUploadActions.UploadActions>, private store$: Store<AppState>) { }

    private getActionFromHttpEvent(mode: any, result: UploadState, index: number, loaded: number, total: number, action: fromFileUploadActions.UploadRequestAction, userId: string, timestamp: number): Observable<void> | any {
        // the current execution context is based on one file, 
        // however we still need to calculate the total progress 
        // for all files (even just for one file). 

        switch (mode.type) {
            case HttpEventType.Sent: {
                return of(this.store$.dispatch(new fromFileUploadActions.UploadStartedAction()))
            }
            
            case HttpEventType.UploadProgress: {
                const payload = this.updateFileUploadState(result, mode, index, action, timestamp)

                return this.updateFileProgress(index, payload.content.pendingFiles, loaded, total, action)
            }

            case HttpEventType.DownloadProgress: {
                return mode
            }

            case HttpEventType.ResponseHeader:
            case HttpEventType.Response: {
                if (mode.status === 400) {
                    const payload = this.updateFileUploadState(result, mode, index, action, timestamp)
                    //this.generateNotification({ userId: userId, title: `${result[index].}`, status: UploadStatus.Failed, files: result })
                    return of(this.store$.dispatch(new fromFileUploadActions.FileUploadFailureAction({ files: payload.content.pendingFiles })))
                }
                else if (mode.status === 204) {
                    const payload = this.updateFileUploadState(result, mode, index, action, timestamp)
                    //this.generateNotification({ userId: userId, title: `${result.files[index].file.name} `, status: UploadStatus.Completed, files: result })
                    return of(this.store$.dispatch(new fromFileUploadActions.FileUploadCompletedAction({ files: payload.content.pendingFiles })))
                }
            }

            default: {
                return of(this.store$.dispatch(
                    new fromFileUploadActions.UploadFailureAction({ error: `Unknown Event: ${JSON.stringify(event)}` })
                ))
            }
        }
    }

    private updateFileProgress(index: number, files: FileState[], loaded: number, total: number, action: UploadActions): Observable<void> {
        const totalProgress = Math.round(loaded / total * 100)
        return of(this.store$.dispatch(
            new fromFileUploadActions.UploadProgressAction(
                { progress: totalProgress, progressColor: this.setProgressBarColorState(action).color, index: index, files: files }
            )
        ))
    }

    private calculateUploadSpeed(timestamp: number, index: number, files: FileState[]): number {
        let time = Date.now() - timestamp
        let chunk = files[index].progress * files[index].file.size
        let speed = parseInt(((chunk / 1024 / 1024) / (time / 1000)).toFixed(2)) //(chunk / 1024 / 1024)
        // console.info(`${files[index].file.name} upload speed: `, speed, 'B/s')
        return speed
    }

    private handleError(error: any): Action {
        const friendlyErrorMessage = serializeError(error).message
        return new fromFileUploadActions.UploadFailureAction({ error: friendlyErrorMessage })
    }

    // this method needs to update the upload state for 
    // ongoing upload actions, as well as cancellation and pause states for files
    private updateFileUploadState(state: UploadState, event: UploadEventState, index: number, action: any, timestamp: number): UpdatedUploadState {

        let payload: any = {}
        let loaded: number = 0
        let progress: number = 0
        let uploadStatus: UploadStatus
        // if (state.status === 'Paused') return state

        // Action during ongoing upload 
        // UPLOAD_REQUEST = '[File Upload Form] Request'
        let clone = _.cloneDeep(state)

        switch (action.type) {
            case ActionTypes.UPLOAD_REQUEST:

                uploadStatus = UploadStatus.Ongoing

            break
            case ActionTypes.SINGLE_FILE_UPLOAD_CANCELLED:
                uploadStatus = UploadStatus.Cancelled
            break
            case ActionTypes.SINGLE_FILE_UPLOAD_PAUSED:
                uploadStatus = UploadStatus.Paused
            break
            case ActionTypes.UPLOAD_COMPLETED:
                uploadStatus = UploadStatus.Completed
            break
        }

        if (event.type === 2 || event.type === 4) {
            loaded = state.pendingFiles[index].loaded
            progress = state.pendingFiles[index].progress
        }
        else {
            loaded = event.loaded
            progress = Math.round((100 * event.loaded) / event.total)
        }

        const newFileState: FileState = {
            progress: progress,
            progressColor: (progress === 100) ? 'accent' : this.setProgressBarColorState(action).color,
            file: state.pendingFiles[index].file,
            loaded: loaded,
            completed: (progress === 100) ? true : false,
            status: uploadStatus, //(progress === 100) ? UploadStatus.Completed : 
            uploadSpeed: this.calculateUploadSpeed(timestamp, index, state.pendingFiles),
            isPaused: state.pendingFiles[index].isPaused
        }

        clone.pendingFiles[index] = newFileState 

        payload.content = clone
        payload.event = event

        return payload

    }

    private setProgressBarColorState(action: UploadActions): any {

        let state: any = {}

        switch (action.type) {
            case ActionTypes.UPLOAD_REQUEST:
                state.color = 'primary'
            break
            case ActionTypes.SINGLE_FILE_UPLOAD_CANCELLED: 
                state.color = 'warm'
            break
            case ActionTypes.SINGLE_FILE_UPLOAD_PAUSED:
                state.color = 'yellow'
            break
            case ActionTypes.SINGLE_FILE_UPLOAD_COMPLETED:
                state.color = 'accent'
            break
            case ActionTypes.UPLOAD_FAILURE:
                state.color = 'warm'
            break
        }

        return state
    }

    private generateNotification(payload: { userId: string, status: UploadStatus, files: FileList }): void {
        
        let status = payload.status === UploadStatus.Completed ? 'been uploaded' : 'failed'
        let message = payload.files.length > 1 ? ` and ${payload.files.length} other items has ` + `${status}` : status
        
        const notification = {
            id: uuid.v4(),
            userId: payload.userId,
            title: "File Upload",
            notificationType: NotificationTypes.Upload,
            status: payload.status,
            files: Object.values<File>(payload.files),
            createdOn: new Date(),
        }


        this.store$.dispatch(createNewNotification(notification))
    }
}