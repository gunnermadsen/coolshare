import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as filesystem from '../actions/filesystem.actions';
import { saveAs } from 'file-saver'

import { FileSystemActionTypes, RetrieveFolderContents, SaveRetrievedFolderContents, FileUpload, CreateFolder, DownloadItem, DownloadItemCancelled, DeleteFolderItem, DeleteFolderItems } from '../actions/filesystem.actions';
import { exhaustMap, map, mergeMap, catchError, concatMap, takeUntil, tap } from 'rxjs/operators';
import { HttpRepoService } from '@/core/http/repo.http.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import * as mime from 'mime';
import { FileSaverService } from 'ngx-filesaver';


@Injectable()
export class FileSystemEffects {

    constructor(private sanitizer: DomSanitizer, private actions$: Actions, private repoService: HttpRepoService, private toastrService: ToastrService, private fileSaver: FileSaverService) { }

    @Effect() 
    public retrieveFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_READ_FOLDER),
        exhaustMap((action: any) => {
            return this.repoService.getFolderContents(action.payload.folder).pipe(
                map((folder: any) => {
                    return new filesystem.SaveRetrievedFolderContents({ contents: folder.content });
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
                    return new filesystem.SaveRetrievedFolderContents({ contents: payload.content })
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
                    return new filesystem.RetrieveFolderContents({ folder: { path: action.payload.path }})
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
                    return new filesystem.RetrieveFolderContents({ folder: { path: action.payload.path }})
                }),
                catchError(error => {
                    this.toastrService.error(error);
                    return throwError(error);
                })
            )
        })
    )


    @Effect({ dispatch: false })
    public downloadItem$ = this.actions$.pipe(
        ofType<DownloadItem>(filesystem.FileSystemActionTypes.FS_DOWNLOAD_ITEM),
        exhaustMap((action: any) => {
            return this.repoService.download(action.payload).pipe(
                tap((response: Blob) => {
                    
                    this.fileSaver.save(response, action.payload.name);
                }),
                catchError((error) => {
                    return throwError(error)
                })
            )
        })


            // const blob = new Blob([response], { type: 'application/octet-stream' });
            // const downloadURL = window.URL.createObjectURL(blob);
            // const link = document.createElement('a');
            // link.href = downloadURL;
            // link.download = action.payload.name;
            // link.click();
        
     
    )


}