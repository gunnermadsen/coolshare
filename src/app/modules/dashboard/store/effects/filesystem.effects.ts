import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as filesystem from '../actions/filesystem.actions';

import { exhaustMap, map, mergeMap, catchError, tap } from 'rxjs/operators';
import { HttpRepoService } from '@/core/http/repo.http.service';
import { ToastrService } from 'ngx-toastr';

import * as mime from 'mime';
import * as fileSaver from 'file-saver';
import { saveAs } from 'file-saver'


import { FileSaverService } from 'ngx-filesaver';

import * as fromNotificationActionTypes from '@/modules/notifications/store/actions/notification.actions';
import { AppState } from '@/reducers';
import { NotificationTypes } from '@/modules/notifications/store/state';



@Injectable()
export class FileSystemEffects {

    constructor(private store$: Store<AppState>, private actions$: Actions, private repoService: HttpRepoService, private toastrService: ToastrService) { }

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
        tap((action: any) => {
            this.generateNotification(action.payload, 0);
            return action;
        }),
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
        ofType(filesystem.FileSystemActionTypes.FS_DELETE_FOLDER_ITEM),
        tap((action: any) => {
            this.generateNotification(action.payload, 1);
            return action;
        }),
        mergeMap((action: any) => {
            return this.repoService.delete(action.payload).pipe(

                tap(() => this.toastrService.success("Delete operation successful")),

                map(() => new filesystem.RetrieveFolderContents({ folder: { path: action.payload.path }})),

                catchError(error => {
                    this.toastrService.error(error);
                    return throwError(error);
                })
            )
        })
    )


    @Effect()
    public deleteFiles$ = this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_DELETE_FOLDER_ITEMS),
        tap((action: any) => {
            this.generateNotification(action.payload, 1);
            return action;
        }),
        mergeMap((action: any) => {

            return this.repoService.delete(action.payload).pipe(

                tap(() => this.toastrService.success("Delete operation successful")),

                map(() => new filesystem.RetrieveFolderContents({ folder: { path: action.payload.path }})),
                
                catchError(error => {
                    this.toastrService.error(error);
                    return throwError(error);
                })
            )
        })
    )


    @Effect({ dispatch: false })
    public downloadItem$ = this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_DOWNLOAD_ITEM),
        tap((action: any) => {
            this.generateNotification(action.payload, 2);
            return action;
        }),
        exhaustMap((action: any) => {
            return this.repoService.download(action.payload).pipe(
                tap((response: Blob) => {
                    
                    const type = mime.getType(name);

                    let blob = new Blob([response], { type: type });

                    fileSaver.saveAs(blob, action.payload.name);

                }),
                catchError((error) => throwError(error))
            )
        })
    )

    public generateNotification(payload: any, mode: number): void {
        let type: NotificationTypes
        let options: any
        let title: string

        switch (mode) {
            case 0: {
                type = payload.data.Accessibility === 0 
                    ? NotificationTypes.CreateNewFolder 
                    : NotificationTypes.CreateNewSharedFolder

                title = `${payload.data.Accessibility === 0 ? "" : "shared "}folder created`
                options = {
                    folderName: payload.data.FolderName
                }
            }
            break;
            case 1: {
                type = payload.items.length === 1 
                    ? NotificationTypes.DeleteFile 
                    : NotificationTypes.DeleteFiles
                    
                title = `${payload.items.length === 1 ? "file" : "files"} deleted`
                options = {
                    deleteContext: payload.items
                }
            }
            break;
            case 2: {
                type = NotificationTypes.FileDownloaded
                title = 'file downloaded'
                options = {
                    fileName: payload.name
                }
            }
            break;
        }

        const result = {
            type: type,
            createdOn: new Date(),
            title: title,
            userId: payload.userId,
            options: options,
        }

        this.store$.dispatch(new fromNotificationActionTypes.CreateNewNotification(result))

    }

}