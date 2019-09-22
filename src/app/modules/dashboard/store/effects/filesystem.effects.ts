import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';

import * as filesystem from '../actions/filesystem.actions';
import * as filesystemSettings from '../actions/settings.actions';

import { exhaustMap, map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
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

    public retrieveFolderContents$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_READ_FOLDER),
        exhaustMap((action: any) => {
            return this.repoService.getFolderContents(action.payload.folder, action.payload.id).pipe(
                switchMap((folder: any) => {
                    return [
                        new filesystem.SaveRetrievedFolderContents({ contents: folder.result }),
                        new filesystemSettings.SaveRetrievedFolderSettings({ settings: folder.settings })
                    ]
                }),
                catchError(error => {
                    return throwError(error)
                })
            )
        })
    ))


    public createFolder$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_CREATE_FOLDER),
        tap((action: any) => {
            this.generateNotification(action.payload, 0);
            return action;
        }),
        mergeMap((action: any) => {
            return this.repoService.createFolder(action.payload).pipe(
                map(() => {
                    return new filesystem.RetrieveFolderContents({ folder: action.payload.path, id: action.payload.userId  })
                }),
                tap(() => {
                    this.toastrService.success("Your folder was created successfully!");
                }),
                catchError(error => {
                    return throwError(error);
                })
            )
        })
    ))

    public deleteFile$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_DELETE_FOLDER_ITEM),
        tap((action: any) => {
            this.generateNotification(action.payload, 1);
            return action;
        }),
        map((action: any) => {
            return { 
                path: action.payload.path, 
                id: action.payload.userId, 
                entities: action.payload.entities 
            }
        }),
        mergeMap((payload: any) => {

            return this.repoService.delete(payload).pipe(

                tap(() => this.toastrService.success(`${payload.entities[0].name} has been deleted`)),

                map(() => new filesystem.RetrieveFolderContents({ folder: payload.path, id: payload.id })),

                catchError(error => {
                    this.toastrService.error(error);
                    return throwError(error);
                })
            )
        })
    ))

    public deleteFiles$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_DELETE_FOLDER_ITEMS),
        tap((action: any) => {
            this.generateNotification(action.payload, 1);
            return action;
        }),
        map((action: any) => {
            return {
                path: action.payload.path,
                id: action.payload.userId,
                entities: action.payload.entities
            }
        }),
        mergeMap((payload: any) => {

            return this.repoService.delete(payload).pipe(

                tap(() => this.toastrService.success(`${payload.entities[0].name} and ${payload.entities.length - 1} other files has been deleted`)),

                map(() => new filesystem.RetrieveFolderContents({ folder: payload.path, id: payload.id })),
                
                catchError(error => {
                    this.toastrService.error(error);
                    return throwError(error);
                })
            )
        })
    ))

    public downloadItem$: Observable<Blob> = createEffect(() =>  this.actions$.pipe(
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
    ), { dispatch: false })

    
    public modifyFavoriteStatus$: Observable<void> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_MODIFY_FAVORITE_STATUS),
        tap((action: any) => {
            this.generateNotification(action.payload, 3)
            return action
        }),
        exhaustMap((action: any) => {
            return this.repoService.updateFavoriteState(action.payload).pipe(

                tap(() => this.toastrService.success("File added to favorites")), 

                catchError((error: any) => {
                    this.toastrService.error(error);
                    return throwError(error);
                })
                
            );
        })
    ), { dispatch: false })

    public renameEntity$: Observable<void> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.FileSystemActionTypes.FS_RENAME_ENTITY),
        tap((action: any) => {
            this.generateNotification(action.payload, 4)
            return action
        }),
        exhaustMap((action: any) => {
            return this.repoService.renameEntity(action.payload).pipe(

                tap(() => this.toastrService.success("File has been renamed successfully")),

                catchError((error: any) => {
                    this.toastrService.error(error);
                    return throwError(error)
                })
            )
        })

    ), { dispatch: false })

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
                type = payload.entities.length === 1 
                    ? NotificationTypes.DeleteFile 
                    : NotificationTypes.DeleteFiles
                    
                title = `${payload.entities.length === 1 ? "file" : "files"} deleted`
                options = {
                    deleteContext: payload.entities
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
            case 3: {
                type = NotificationTypes.AddToFavorites
                title = 'file added to favorites'
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