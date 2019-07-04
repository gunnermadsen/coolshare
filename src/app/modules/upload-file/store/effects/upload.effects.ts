import { Injectable } from '@angular/core';
import { Observable, of, throwError, forkJoin, combineLatest } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { concatMap, takeUntil, map, catchError, finalize, tap, switchMap, withLatestFrom, mergeMap, concatMapTo, concatAll } from 'rxjs/operators';
import { FileSystemActionTypes, SaveRetrievedFolderContents, RetrieveFolderContents } from '@/modules/dashboard/store/actions/filesystem.actions';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import serializeError from 'serialize-error';
import * as fromFileUploadActions from '../actions/upload.actions';
import { HttpRepoService } from '@/core/http/repo.http.service';


@Injectable()
export class UploadEffects {

    @Effect()
    public uploadFile$: Observable<Action> = this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_REQUEST),
        concatMap((action: any) => {
            return this.repoService.uploadFile(action.payload).pipe(
                takeUntil(
                    this.actions$.pipe(
                        ofType(fromFileUploadActions.ActionTypes.UPLOAD_CANCEL)
                    )
                ),
             
                map((event: HttpEvent<any>) => {
                    return this.getActionFromHttpEvent(event);
                }),
             
                catchError((error) => of(this.handleError(error)))
            )
        })
    
    )

    // @Effect()
    // public uploadData$ = this.actions$.pipe(
    //     ofType(fromFileUploadActions.ActionTypes.UPLOAD_REQUEST),
        
    //     mergeMap((action: any, index: number) => {
    //         const files: any[] = Object.values(action.payload.files);

    //         const requests$ = files.map((file: File, index: number) => {
    //             return this.repoService.uploadFile(file, index, action.payload.path, action.payload.id).pipe(
    //                 takeUntil(
    //                     this.actions$.pipe(
    //                         ofType(fromFileUploadActions.ActionTypes.UPLOAD_CANCEL)
    //                     )
    //                 ),
    //                 map((event: HttpEvent<any>) => {
    //                     return this.getActionFromHttpEvent(event, index);
    //                 }),
    
    //                 catchError((error) => {
    //                     return of(this.handleError(error));
    //                 })
    //             )
    //         })

    //         return forkJoin(requests$);

    //         // return forkJoin(requests$).pipe(
    //         //     concatAll(),
    //         //     map((action: any) => {
                    
    //         //     })
    //         // )
    //     })
    // )

    @Effect()
    public getFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType(fromFileUploadActions.ActionTypes.UPLOAD_COMPLETED),
        map((action) => {
            return new SaveRetrievedFolderContents({ contents: action.payload.files })
        }),
    )

    constructor(private repoService: HttpRepoService, private actions$: Actions<fromFileUploadActions.Actions>) { }

    private getActionFromHttpEvent(event: any): Action {
        switch (event.type) {
            case HttpEventType.Sent: {
                return new fromFileUploadActions.UploadStartedAction();
            }
            case HttpEventType.UploadProgress: {
                const progress = Math.round((100 * event.loaded) / event.total);
                console.log(progress);
                return new fromFileUploadActions.UploadProgressAction({
                    progress: progress
                });
            }
            case HttpEventType.ResponseHeader:
            case HttpEventType.Response: {
                if (event.status === 200 && event.body) {
                    return new fromFileUploadActions.UploadCompletedAction({ files: event.body });
                } else {
                    return new fromFileUploadActions.UploadFailureAction({
                        error: event.statusText
                    });
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
}