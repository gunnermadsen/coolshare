import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as filesystem from '../actions/filesystem.actions';

import { FileSystemActionTypes, RetrieveFolderContents, SaveRetrievedFolderContents, FileUpload, CreateFolder, DownloadItem, DownloadItemCancelled, DeleteFolderItem, DeleteFolderItems } from '../actions/filesystem.actions';
import { exhaustMap, map, mergeMap, catchError, concatMap, takeUntil, tap } from 'rxjs/operators';
import { HttpRepoService } from '@/core/http/repo.http.service';
import { ToastrService } from 'ngx-toastr';



@Injectable()
export class FileSystemEffects {

    constructor(private actions$: Actions, private repoService: HttpRepoService, private toastrService: ToastrService) { }

    @Effect() 
    public retrieveFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_READ_FOLDER),
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
        ofType(filesystem.FileSystemActionTypes.FS_CREATE_FOLDER),
        mergeMap((action: any) => {

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
    public deleteFile$ = this.actions$.pipe(
        ofType<DeleteFolderItem>(FileSystemActionTypes.FS_DELETE_FOLDER_ITEM),
        mergeMap((action) => {

            const payload = { 
                path: action.payload.path, 
                items: action.payload.items
            }

            return this.repoService.delete(payload).pipe(
                tap(() => {
                    this.toastrService.success("Delete operation successful");
                }),
                map(() => {
                    return new RetrieveFolderContents({ folder: { path: action.payload.path }})
                }),
                catchError(error => {
                    this.toastrService.error(error);
                    return throwError(error);
                })
            )
        })
    )
    @Effect()
    public deleteFiles$ = this.actions$.pipe(
        ofType<DeleteFolderItems>(FileSystemActionTypes.FS_DELETE_FOLDER_ITEMS),
        mergeMap((action) => {

            const payload = { 
                path: action.payload.path, 
                items: action.payload.items
            }

            return this.repoService.delete(payload).pipe(
                tap(() => {
                    this.toastrService.success("Delete operation successful");
                }),
                map(() => {
                    return new RetrieveFolderContents({ folder: { path: action.payload.path }})
                }),
                catchError(error => {
                    this.toastrService.error(error);
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