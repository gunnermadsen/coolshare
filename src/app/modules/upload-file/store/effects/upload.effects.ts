import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { takeUntil, map, catchError, tap, mergeMap, takeWhile, switchMap, withLatestFrom, combineLatest } from 'rxjs/operators';
import { SaveRetrievedFolderContents, RetrieveFolderContents } from '@/modules/dashboard/store/actions/filesystem.actions';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import serializeError from 'serialize-error';
import { HttpRepoService } from '@/core/http/repo.http.service';
import { AppState } from '@/reducers';

import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import * as fromFileUploadActions from '../actions/upload.actions';

import { State, UploadStatus } from '../../state';

import * as _ from 'lodash';

export interface FileUploadState {
    progress: number;
    file: File;
    loaded: number;
    completed: boolean;
    status: UploadStatus;
}


@Injectable()
export class UploadEffects {

    @Effect()
    public uploadFile$: Observable<Action> = this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_REQUEST),
        mergeMap((action: any) => {          
            
            let total: number = 0;
            let loaded: number = 0;
            const files: any[] = Object.values(action.payload.files);

            files.forEach((file: File) => total += file.size);

            const requests$ = files.map((file: File, index: number) => {
                return this.repoService.uploadFile(file, action.payload.path, action.payload.userId, index).pipe(
                    takeUntil(this.actions$.pipe(ofType(fromFileUploadActions.ActionTypes.UPLOAD_CANCEL))),
                    withLatestFrom(this.store$.pipe(
                        select(fromFileUploadSelectors.selectUploadState),
                        tap((state: any) => {
                            loaded = 0
                            state.files.forEach((payload: any) => {
                                loaded += payload.loaded
                            });
                            return state
                        }),
                        catchError((error: any) => {
                            return throwError(this.handleError(error));
                        })
                    )),
                    // map((state: any) => {
                    //     const uploadState = this.updateFileUploadState(state, index);
                    //     return uploadState;
                    // }),
                    map((state: any) => {
                        return this.getActionFromHttpEvent(state, index, loaded, total);
                    }),
                    // map((result: any) => {
                    //     return this.getActionFromHttpEvent(result, index, loaded, total);
                    // }),
                    catchError((error: any) => {
                        return throwError(this.handleError(error));
                    })
                )
            })
            return forkJoin(requests$).pipe(
                map((action: any) => {
                    return action;
                }),
                catchError((error: any) => {
                    return throwError(this.handleError(error));
                })
            )
        }),
        // map((action: any) => {
        //     return new RetrieveFolderContents({ folder: { id: action.payload.userId, path: action.payload.path }})
        // }), 
        switchMap((action: any) => [
            new RetrieveFolderContents({ folder: { id: action.payload.userId, path: action.payload.path } }),
            new fromFileUploadActions.UploadCompletedAction()
        ]),
        catchError((error: any) => throwError(this.handleError(error)))
    )

    @Effect()
    public getFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_FINISHED),
        map((action) => {
            return new SaveRetrievedFolderContents({ contents: action.payload.files })
        }),
    )

    constructor(private repoService: HttpRepoService, private actions$: Actions<fromFileUploadActions.UploadActions>, private store$: Store<AppState>) { }

    private getActionFromHttpEvent(result: any, index: number, loaded: number, total: number): Action {

        switch (result[0].type) {
            case HttpEventType.Sent: {
                return new fromFileUploadActions.UploadStartedAction();
            }
            
            case HttpEventType.UploadProgress: {

                // the current execution context is based on one file, however we still need to calculate the total progress for all files (even just for one file). 
                const totalProgress = Math.round((100 * loaded) / total);
                
                console.log(`Progress of file ${index}: ${totalProgress}%`);

                const payload = this.updateFileUploadState(result, index);

                return new fromFileUploadActions.UploadProgressAction({
                    progress: totalProgress,
                    index: index,
                    files: payload.content.files
                });

            }

            case HttpEventType.ResponseHeader:
            case HttpEventType.Response: {
                if (result[0].event.status === 500) {
                    return new fromFileUploadActions.UploadFailureAction({
                        error: result[0].event.statusText
                    });
                }
                else if (result[0].event.status === 200) {
                    // return new fromFileUploadActions.UploadCompletedAction({ index: index });
                    return new fromFileUploadActions.UploadCompletedAction();
                }
            }

            default: {
                return new fromFileUploadActions.UploadFailureAction({
                    error: `Unknown Event: ${JSON.stringify(event)}`
                });
            }
        }
    }

    private handleError(error: any): Action {
        const friendlyErrorMessage = serializeError(error).message;
        console.error(friendlyErrorMessage);
        return new fromFileUploadActions.UploadFailureAction({
            error: friendlyErrorMessage
        });
    }

    // Formula for calculating the progress

    /* Math.round((100 * event.loaded) / event.total); */

    /** 
     * Payload must contain:
     *      - The current file index.
     *      - The files being uploaded
     *      - The http event
     */

    private updateFileUploadState(state: any, index: number): any {

        let payload: any = {};

        const progress: number = Math.round((100 * state[0].loaded) / state[0].total)
        let clone = _.cloneDeep(state);

        const content = {
            progress: progress,
            file: state[1].files[index].file,
            loaded: state[0].loaded,
            completed: (progress === 100) ? true : false,
            status: (progress === 100) ? UploadStatus.Completed : UploadStatus.Started
        }

        clone[1].files[index] = content //.splice(index, 1, content);

        payload.content = clone[1];
        payload.event = state[0];

        return payload;

    }
}



// subscribe to upload state changes and recalculate the amount of data loaded.
// this.store$.pipe(
//     //takeWhile(() => Math.round((100 * loaded) / total) <= 100),
//     select(fromFileUploadSelectors.selectUploadState)
// )
//     .subscribe((state: any) => {
//         loaded = 0;
//         return state.files.forEach((payload: any) => {
//             loaded += payload.loaded;
//         });
//     });



// combineLatest(this.store$.pipe(
//     select(fromFileUploadSelectors.selectUploadState),
//     takeUntil(this.actions$.pipe(
//         ofType(fromFileUploadActions.ActionTypes.UPLOAD_COMPLETED)
//     )), (state: any) => {
//         return state;
//     }

//     // catchError((error: any) => of(this.handleError(error)))
// )),






// let progress: number = 0;
// if (event[0].loaded) {

//     // calculate the total progress for all files, 
//     // using the amount loaded divided by the sum of their sizes
//     progress = Math.round((100 * loaded) / total);

//     console.log(`Progress of file ${files[index].name}: ${progress}%`);

//     this.store$.dispatch(new fromFileUploadActions.UploadProgressAction({
//         progress: progress,
//         index: index,
//         httpEvent: event,
//         files: event[1].files
//     }));

// }