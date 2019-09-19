import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { takeUntil, map, catchError, tap, mergeMap, withLatestFrom, retryWhen, take, switchMapTo, switchMap } from 'rxjs/operators';
import { SaveRetrievedFolderContents, RetrieveFolderContents } from '@/modules/dashboard/store/actions/filesystem.actions';
import { HttpEventType } from '@angular/common/http';
import serializeError from 'serialize-error';
import { HttpRepoService } from '@/core/http/repo.http.service';
import { AppState } from '@/reducers';

import { UploadActions, ActionTypes } from '../actions/upload.actions';


import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import * as fromFileUploadActions from '../actions/upload.actions';

import * as fromNotificationActionTypes from '@/modules/notifications/store/actions/notification.actions';

import { UploadStatus } from '../../state';

import * as _ from 'lodash';
import { NotificationTypes } from '@/modules/notifications/store/state';

@Injectable()
export class UploadEffects {

    @Effect()
    public uploadFile$: Observable<Action> = this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_REQUEST),
        tap((action: any) => {
            this.generateNotification(action.payload)
            return action;
        }),
        mergeMap((action: any) => {      
            
            let path = action.payload.path;
            let userId = action.payload.userId;
            
            let total: number = 0;
            let loaded: number = 0;
            const files: any[] = Object.values(action.payload.files);

            files.forEach((file: File) => total += file.size);

            const requests$ = files.map((file: File, index: number) => {
                return this.repoService.uploadFile(file, path, index, userId).pipe(
                    takeUntil(this.actions$.pipe(
                        ofType(
                            fromFileUploadActions.ActionTypes.UPLOAD_CANCEL, 
                            fromFileUploadActions.ActionTypes.UPLOAD_COMPLETED
                        ),
                        withLatestFrom(this.store$.pipe(take(1), select(fromFileUploadSelectors.selectUploadState))),
                        switchMap((action: any) => {
                            switch (action[0].type) {
                                case ActionTypes.UPLOAD_CANCEL: {
                                    return this.updateFileUploadState(action[1], action[0].type, action[0].payload.index, action)
                                }
                                default: {
                                    return action;
                                }
                            }
                        })
                    )),
                    withLatestFrom(this.store$.pipe(
                        select(fromFileUploadSelectors.selectUploadState),
                        takeUntil(this.actions$.pipe(
                            ofType(fromFileUploadActions.ActionTypes.UPLOAD_COMPLETED),

                        ))
                    )),
                    tap(([mode, state]) => {
                        loaded = 0
                        state.pendingFiles.forEach((payload: any) => loaded += payload.loaded);
                        if (loaded >= total) {
                            this.updateFileProgress(index, state.pendingFiles, loaded, total, action);
                        }
                        return state
                    }),
                    map(([mode, state]) => this.getActionFromHttpEvent(mode, state, index, loaded, total, action)),

                    catchError((error: any) => throwError(this.handleError(error)))
                )
            })
            return forkJoin(requests$).pipe(
                map(() => {
                    return { folder: path, id: userId }
                }),

                catchError((error: any) => throwError(this.handleError(error)))
            )
        }),
        switchMap((action: any) => {
            return [
                new fromFileUploadActions.UploadCompletedAction(),
                new RetrieveFolderContents({ ...action }),
            ]
        }),
    )

    // @Effect()
    // public getFolderContents$: Observable<Action> = this.actions$.pipe(
    //     ofType(fromFileUploadActions.ActionTypes.UPLOAD_FINISHED),
    //     map((action) => new SaveRetrievedFolderContents({ contents: action.payload.files })),
    // )

    constructor(private repoService: HttpRepoService, private actions$: Actions<fromFileUploadActions.UploadActions>, private store$: Store<AppState>) { }
    
    private getActionFromHttpEvent(mode: any, result: any, index: number, loaded: number, total: number, action: UploadActions): Observable<void> | any {
        // the current execution context is based on one file, 
        // however we still need to calculate the total progress 
        // for all files (even just for one file). 

        switch (mode.type) {
            case HttpEventType.Sent: {
                return of(this.store$.dispatch(new fromFileUploadActions.UploadStartedAction()));
            }
            
            case HttpEventType.UploadProgress: {

                const payload = this.updateFileUploadState(result, mode, index, action);

                return this.updateFileProgress(index, payload.content.pendingFiles, loaded, total, action);

            }

            case HttpEventType.DownloadProgress: {
                return mode;
            }

            case HttpEventType.ResponseHeader:
            case HttpEventType.Response: {
                if (mode.status === 400) {
                    const payload = this.updateFileUploadState(result, mode, index, action);
                    return of(this.store$.dispatch(new fromFileUploadActions.FileUploadFailureAction({ files: payload.content.pendingFiles })));
                }
                else if (mode.status === 204) {
                    const payload = this.updateFileUploadState(result, mode, index, action);
                    return of(this.store$.dispatch(new fromFileUploadActions.FileUploadCompletedAction({ files: payload.content.pendingFiles })));
                }
            }

            default: {
                return of(this.store$.dispatch(new fromFileUploadActions.UploadFailureAction({ error: `Unknown Event: ${JSON.stringify(event)}` })));
            }
        }
    }

    private updateFileProgress(index: number, files: any, loaded: number, total: number, action: UploadActions): Observable<void> {
        const totalProgress = Math.round(loaded / total * 100);
        console.log(`Progress of file ${index}: ${totalProgress}%`);
        return of(this.store$.dispatch(new fromFileUploadActions.UploadProgressAction({
            progress: totalProgress,
            progressColor: this.setProgressState(action).color,
            index: index,
            files: files
        })));
    }

    private handleError(error: any): Action {
        const friendlyErrorMessage = serializeError(error).message;
        return new fromFileUploadActions.UploadFailureAction({ error: friendlyErrorMessage });
    }

    private updateFileUploadState(state: any, event: any, index: number, action: any): any {

        let payload: any = {}
        let loaded: number = 0
        let progress: number = 0

        // if (state.status === 'Paused') return state

        let clone = _.cloneDeep(state)

        const progressState: any = this.setProgressState(action)

        if (event.type === 2 || event.type === 4) {
            loaded = state.pendingFiles[index].loaded
            progress = state.pendingFiles[index].progress
        } 
        else {
            loaded = event.loaded
            progress = Math.round((100 * event.loaded) / event.total)
        }

        const newFileState = {
            progress: progress,
            progressColor: (progress === 100) ? 'accent' : progressState.color,
            file: state.pendingFiles[index].file,
            loaded: loaded,
            completed: (progress === 100) ? true : false,
            status: (progress === 100) ? UploadStatus.Completed : UploadStatus.Started
        }

        clone.pendingFiles[index] = newFileState 

        payload.content = clone
        payload.event = event

        return payload

    }

    private setProgressState(action: UploadActions): any {

        let state: any = {};

        switch (action.type) {
            case ActionTypes.UPLOAD_REQUEST:
                state.color = 'primary'
            break;
            case ActionTypes.SINGLE_FILE_UPLOAD_CANCELLED: 
                state.color = 'warm'
            break;
            case ActionTypes.SINGLE_FILE_UPLOAD_PAUSED:
                state.color = 'yellow'
            break
            case ActionTypes.SINGLE_FILE_UPLOAD_COMPLETED:
                state.color = 'accent'
            break;
            case ActionTypes.UPLOAD_FAILURE:
                state.color = 'warm'
            break;
        }

        return state;
    }

    private generateNotification(payload: any): void {
        const result = {
            type: NotificationTypes.Upload,
            createdOn: new Date(),
            title: 'file uploaded',
            userId: payload.userId,
            files: Object.values<File>(payload.files)
        }

        this.store$.dispatch(new fromNotificationActionTypes.CreateNewNotification(result))
    }
}