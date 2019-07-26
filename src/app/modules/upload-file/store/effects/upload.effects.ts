import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { takeUntil, map, catchError, tap, mergeMap, takeWhile } from 'rxjs/operators';
import { SaveRetrievedFolderContents, RetrieveFolderContents } from '@/modules/dashboard/store/actions/filesystem.actions';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import serializeError from 'serialize-error';
import { HttpRepoService } from '@/core/http/repo.http.service';
import { AppState } from '@/reducers';

import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import * as fromFileUploadActions from '../actions/upload.actions';

import { State, UploadStatus } from '../../state';

import * as _ from 'lodash';


@Injectable()
export class UploadEffects {

    @Effect()
    public uploadFile$: Observable<Action> = this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_REQUEST),
        mergeMap((action: any) => {          
            
            let total: number = 0;
            let loaded: number = 0;
            const files: any[] = Object.values(action.payload.files);

            files.map((file: File) => {
                return total += file.size;
            })

            // subscribe to upload state changes and recalculate the amount of data loaded.
            this.store$
                .pipe(
                    takeWhile(() => Math.round((100 * loaded) / total) <= 100),
                    select(fromFileUploadSelectors.selectUploadState)
                )
                .subscribe((state: any) => {
                    loaded = 0;
                    return state.files.forEach((payload: any, index: number) => {
                        loaded += state.files[index].loaded;
                    });
                });

            const requests$ = files.map((file: File, index: number) => {
                return this.repoService.uploadFile(file, action.payload.path, action.payload.userId, index).pipe(
                    takeUntil(
                        this.actions$.pipe(
                            ofType(fromFileUploadActions.ActionTypes.UPLOAD_CANCEL)
                        )
                    ),
                    tap((event: any) => {
                        let progress: number = 0;
                        if (event.loaded) {

                            // calculate the total progress for all files, 
                            // using the amount loaded divided by the sum of their sizes
                            progress = Math.round((100 * loaded) / total);

                            console.log(`Progress of file ${files[index].name}: ${progress}%`);

                            this.store$.dispatch(new fromFileUploadActions.UploadProgressAction({
                                progress: progress,
                                index: index,
                                httpEvent: event,
                                //files: updateFileUploadProgress()
                            }));

                        }
                        return event; 
                    }),
                    map((event: HttpEvent<any>) => {
                        return this.getActionFromHttpEvent(event, index, loaded, total);
                    }),
                    catchError((error: any) => of(this.handleError(error)))
                )
            })
            return forkJoin(requests$).pipe(
                map((action: any) => {
                    return action;
                }),
                catchError((error: any) => of(this.handleError(error)))
            )
        }),
        map((action: any) => {
            return new RetrieveFolderContents({ folder: { id: action.payload.userId, path: action.payload.path }})
        }),
        // switchMap((action: any) => [
        //     new RetrieveFolderContents({ folder: { id: action.payload.userId, path: action.payload.path } }),
        //     new fromFileUploadActions.UploadCompletedAction()
        // ]),
        catchError((error: any) => of(this.handleError(error)))
    )

    @Effect()
    public getFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_FINISHED),
        map((action) => {
            return new SaveRetrievedFolderContents({ contents: action.payload.files })
        }),
    )

    constructor(private repoService: HttpRepoService, private actions$: Actions<fromFileUploadActions.Actions>, private store$: Store<AppState>) { }

    private getActionFromHttpEvent(event: any, index: number, loaded: number, total: number): Action {

        switch (event.type) {
            case HttpEventType.Sent: {
                return new fromFileUploadActions.UploadStartedAction();
            }
            
            case HttpEventType.UploadProgress: {

                // the current execution context is based on one file, however we still need to calculate the total progress for all files (even just for one file). 
                const totalProgress = Math.round((100 * loaded) / total);

                console.log(`Progress of file ${index}: ${totalProgress}%`);

                return new fromFileUploadActions.UploadProgressAction({
                    progress: totalProgress,
                    index: index,
                    httpEvent: event
                });

            }

            case HttpEventType.ResponseHeader:
            case HttpEventType.Response: {
                if (event.status === 500) {
                    return new fromFileUploadActions.UploadFailureAction({
                        error: event.statusText
                    });
                }
                else if (event.status === 200) {
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
        return new fromFileUploadActions.UploadFailureAction({
            error: friendlyErrorMessage
        });
    }

    // Formula for calculating the progress

    /* Math.round((100 * event.loaded) / event.total); */

    private updateFileUploadProgress(state: State, payload: any): any {

        if (state.files[payload.index].loaded < payload.httpEvent.loaded) {
            let data: any = _.cloneDeep(state);

            const progress: number = Math.round((100 * payload.httpEvent.loaded) / payload.httpEvent.total)

            const content = {
                progress: progress,
                file: data.files[payload.index].file,
                loaded: payload.httpEvent.loaded,
                completed: (progress === 100) ? true : false,
                status: (progress === 100) ? UploadStatus.Completed : UploadStatus.Started
            }

            data.files.splice(payload.index, 1, content);

            return data.files;
        }
        else {
            return state.files;
        }

    }
}