import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FileSystemActionTypes, RetrieveFolderContents, SaveRetrievedFolderContents, FileUpload, CreateFolder, DeleteItem, DownloadItem, DownloadItemCancelled } from '../actions/filesystem.actions';
import { exhaustMap, map, mergeMap, catchError, concatMap, takeUntil, tap } from 'rxjs/operators';
import { HttpRepoService } from '@/core/http/repo.http.service';
import { ToastrService } from 'ngx-toastr';



@Injectable()
export class FileSystemEffects {

    constructor(private actions$: Actions, private repoService: HttpRepoService, private toastrService: ToastrService) { }

    @Effect() 
    public retrieveFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType<RetrieveFolderContents>(FileSystemActionTypes.RetrieveFolderContents),
        exhaustMap((action: any) => {
            return this.repoService.getFolderContents(action.payload.folder).pipe(
                map((folder: any) => {
                    return new SaveRetrievedFolderContents({ contents: folder.content });
                }),
                catchError(error => {
                    return throwError(error)
                })
            )
        })
    )


    @Effect()
    public createFolder$: Observable<Action> = this.actions$.pipe(
        ofType<CreateFolder>(FileSystemActionTypes.CreateNewFolderRequested),
        mergeMap((action) => {
            return this.repoService.createFolder(action.payload).pipe(
                map((payload: any) => {
                    return new SaveRetrievedFolderContents({ contents: payload.content })
                }),
                tap(() => {
                    this.toastrService.success("Your folder was created successfully!");
                }),
                catchError(error => {
                    return throwError(error);
                })
            )
        })
    )


    @Effect()
    public deleteItem$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteItem>(FileSystemActionTypes.DeleteItem),
        mergeMap((action) => {
            return this.repoService.delete(action.payload).pipe(
                map((contents) => {
                    return new SaveRetrievedFolderContents({ contents: contents })
                }),
                catchError(error => {
                    return throwError(error);
                })
            )
        })
    )


    // @Effect()
    // public downloadItem$: Observable<Action> = this.actions$.pipe(
    //     ofType<DownloadItem>(FileSystemActionTypes.DownloadItem),
    //     mergeMap((action) => {
    //         return this.repoService.download(action.payload)
    //     }),
    //     map((blob: any) => {
    //         const url = window.URL.createObjectURL(blob);


    //     }),
    //     catchError((error) => {
    //         return throwError(error)
    //     })
        
    // )


}