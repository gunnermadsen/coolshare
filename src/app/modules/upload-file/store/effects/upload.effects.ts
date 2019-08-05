import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { takeUntil, map, catchError, tap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { SaveRetrievedFolderContents, RetrieveFolderContents } from '@/modules/dashboard/store/actions/filesystem.actions';
import { HttpEventType } from '@angular/common/http';
import serializeError from 'serialize-error';
import { HttpRepoService } from '@/core/http/repo.http.service';
import { AppState } from '@/reducers';

import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import * as fromFileUploadActions from '../actions/upload.actions';

import { UploadStatus } from '../../state';

import * as _ from 'lodash';

@Injectable()
export class UploadEffects {

    @Effect()
    public uploadFile$: Observable<Action> = this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_REQUEST),
        mergeMap((action: any) => {      
            
            let path = action.payload.path;
            
            let total: number = 0;
            let loaded: number = 0;
            const files: any[] = Object.values(action.payload.files);

            files.forEach((file: File) => total += file.size);

            const requests$ = files.map((file: File, index: number) => {
                return this.repoService.uploadFile(file, path, index).pipe(
                    takeUntil(this.actions$.pipe(
                        ofType(fromFileUploadActions.ActionTypes.UPLOAD_CANCEL))
                    ),
                    withLatestFrom(this.store$.pipe(
                        select(fromFileUploadSelectors.selectUploadState),
                        takeUntil(this.actions$.pipe(ofType(fromFileUploadActions.ActionTypes.UPLOAD_COMPLETED)))
                    )),
                    tap(([mode, state]) => {
                        loaded = 0
                        state.files.forEach((payload: any) => loaded += payload.loaded);
                        if (loaded >= total) {
                            this.updateFileProgess(index, state.files, loaded, total);
                        }
                        return state
                    }),
                    map(([mode, state]) => {
                        return this.getActionFromHttpEvent(mode, state, index, loaded, total);
                    }),
                    catchError((error: any) => {
                        return throwError(this.handleError(error));
                    })
                )
            })
            return forkJoin(requests$).pipe(
                map((action: any) => {
                    return [ action, path ];
                }),
                catchError((error: any) => {
                    return throwError(this.handleError(error));
                })
            )
        }),
        mergeMap((action: any) => {
            return [
                new fromFileUploadActions.UploadCompletedAction(),
                new RetrieveFolderContents({ folder: { path: action[1] } }),
            ]
        }),
    )

    @Effect()
    public getFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_FINISHED),
        map((action) => {
            return new SaveRetrievedFolderContents({ contents: action.payload.files })
        }),
    )

    constructor(private repoService: HttpRepoService, private actions$: Actions<fromFileUploadActions.UploadActions>, private store$: Store<AppState>) { }

    private getActionFromHttpEvent(mode: any, result: any, index: number, loaded: number, total: number) {
        // the current execution context is based on one file, 
        // however we still need to calculate the total progress 
        // for all files (even just for one file). 

        switch (mode.type) {
            case HttpEventType.Sent: {
                return of(this.store$.dispatch(new fromFileUploadActions.UploadStartedAction()));
            }
            
            case HttpEventType.UploadProgress: {

                const payload = this.updateFileUploadState(result, mode, index);

                return this.updateFileProgess(index, payload.content.files, loaded, total);

            }

            case HttpEventType.DownloadProgress: {
                return mode;
            }

            case HttpEventType.ResponseHeader:
            case HttpEventType.Response: {
                if (mode.status === 500) {
                    const payload = this.updateFileUploadState(result, mode, index);
                    return of(this.store$.dispatch(new fromFileUploadActions.FileUploadFailureAction({ files: payload.content.files })));
                }
                else if (mode.status === 204) {
                    const payload = this.updateFileUploadState(result, mode, index);
                    return of(this.store$.dispatch(new fromFileUploadActions.FileUploadCompletedAction({ files: payload.content.files })));
                }
            }

            default: {
                return of(this.store$.dispatch(new fromFileUploadActions.UploadFailureAction({
                    error: `Unknown Event: ${JSON.stringify(event)}`
                })));
            }
        }
    }

    private updateFileProgess(index: number, files: any, loaded: number, total: number): any {
        const totalProgress = Math.round(loaded / total * 100);
        console.log(`Progress of file ${index}: ${totalProgress}%`);
        return of(this.store$.dispatch(new fromFileUploadActions.UploadProgressAction({
            progress: totalProgress,
            index: index,
            files: files
        })));
    }

    private handleError(error: any): Action {
        const friendlyErrorMessage = serializeError(error).message;
        console.error(friendlyErrorMessage);
        return new fromFileUploadActions.UploadFailureAction({
            error: friendlyErrorMessage
        });
    }

    private updateFileUploadState(state: any, event: any, index: number): any {

        let payload: any = {}
        let loaded: number = 0
        let progress: number = 0

        
        let clone = _.cloneDeep(state)

        if (event.type === 2 || event.type === 4) {
            loaded = state.files[index].loaded
            progress = state.files[index].progress
        } 
        else {
            loaded = event.loaded
            progress = Math.round((100 * event.loaded) / event.total)
        }

        const newFileState = {
            progress: progress,
            file: state.files[index].file,
            loaded: loaded,
            completed: (progress === 100) ? true : false,
            status: (progress === 100) ? UploadStatus.Completed : UploadStatus.Started
        }

        clone.files[index] = newFileState 

        payload.content = clone
        payload.event = event

        return payload

    }
}