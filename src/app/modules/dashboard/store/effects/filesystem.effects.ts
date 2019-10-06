import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { Action, Store } from '@ngrx/store'
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects'
import * as uuid from 'uuid'

import * as filesystem from '../actions/filesystem.actions'
import * as filesystemSettings from '../actions/settings.actions'

import { exhaustMap, map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators'
import { HttpRepoService } from '@/core/http/repo.http.service'
import { ToastrService } from 'ngx-toastr'

import * as mime from 'mime'
import * as fileSaver from 'file-saver'
import { saveAs } from 'file-saver'


import { FileSaverService } from 'ngx-filesaver'

import * as fromNotificationActionTypes from '@/modules/notifications/store/actions/notification.actions'
import { AppState } from '@/reducers'
import { NotificationTypes } from '@/modules/notifications/store/state'
import { createNewNotification } from '@/modules/notifications/store/actions/notification.actions'



@Injectable()
export class FileSystemEffects {

    constructor(private store$: Store<AppState>, private actions$: Actions, private repoService: HttpRepoService, private toastrService: ToastrService) { }

    public retrieveFolderContents$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.readEntityContents),
        exhaustMap((payload: any) => {
            return this.repoService.getFolderContents(payload.folder, payload.id).pipe(

                switchMap((folder: any) => {
                    return [
                        filesystem.saveRetrievedFolderContents({ contents: folder.result }),
                        new filesystemSettings.SaveRetrievedFolderSettings({ settings: folder.settings })
                    ]
                }),

                catchError(error => throwError(error))

            )
        })
    ))


    public createFolder$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.createFolder),
        tap((payload: any) => {
            this.generateNotification(payload, 0)
            return payload
        }),
        mergeMap((payload: any) => {
            return this.repoService.createFolder(payload).pipe(
                map(() => {
                    return filesystem.readEntityContents({ folder: payload.path, id: payload.userId  })
                }),
                tap(() => {
                    this.toastrService.success("Your folder was created successfully!")
                }),
                catchError(error => throwError(error))
            )
        })
    ))

    public deleteEntity$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.deleteFolderEntity),
        tap((payload: any) => {
            this.generateNotification(payload, 1)
            return payload
        }),
        map((payload: any) => {
            return { 
                path: payload.path, 
                id: payload.userId, 
                entities: payload.entities 
            }
        }),
        mergeMap((payload: any) => {

            return this.repoService.delete(payload).pipe(

                tap(() => this.toastrService.success(`${payload.entities[0].name} has been deleted`)),

                map(() => filesystem.readEntityContents({ folder: payload.path, id: payload.id })),

                catchError(error => {
                    this.toastrService.error(error)
                    return throwError(error)
                })
            )
        })
    ))

    public deleteEntities$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.deleteFolderEntities),
        tap((payload: any) => {
            this.generateNotification(payload, 1)
            return payload
        }),
        map((payload: any) => {
            return {
                path: payload.path,
                id: payload.userId,
                entities: payload.entities
            }
        }),
        mergeMap((payload: any) => {

            return this.repoService.delete(payload).pipe(

                tap(() => this.toastrService.success(`${payload.entities[0].name} and ${payload.entities.length - 1} other files has been deleted`)),

                map(() => filesystem.readEntityContents({ folder: payload.path, id: payload.id })),
                
                catchError(error => {
                    this.toastrService.error(error)
                    return throwError(error)
                })
            )
        })
    ))

    public downloadEntity$: Observable<Blob> = createEffect(() =>  this.actions$.pipe(
        ofType(filesystem.downloadEntity),
        tap((payload: any) => {
            this.generateNotification(payload, 2)
            return payload
        }),
        exhaustMap((payload: any) => {
            return this.repoService.download(payload).pipe(
                tap((response: Blob) => {

                    const type = mime.getType(name)

                    let blob = new Blob([response], { type: type })

                    fileSaver.saveAs(blob, payload.name)

                }),
                catchError((error) => throwError(error))
            )
        })
    ), { dispatch: false })

    
    public modifyFavoriteStatus$: Observable<void> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.updateFavoriteStatus),
        tap((payload: any) => {
            this.generateNotification(payload, 3)
            return payload
        }),
        exhaustMap((payload: any) => {
            return this.repoService.updateFavoriteState(payload).pipe(
 
                tap(() => this.toastrService.success("File added to favorites")), 

                catchError((error: any) => {
                    this.toastrService.error(error)
                    return throwError(error)
                })
                
            )
        })
    ), { dispatch: false })

    public renameEntity$: Observable<void> = createEffect(() => this.actions$.pipe(
        ofType(filesystem.renameEntity),
        tap((payload: any) => {
            this.generateNotification(payload.body, 4)
            return payload
        }),

        map((payload: any) => payload.body),

        exhaustMap((payload: any) => {
            return this.repoService.renameEntity(payload).pipe(

                tap(() => this.toastrService.success(`${payload.entity.oldName} has been renamed to ${payload.entity.newName}`)),

                // map(() => new filesystem.RetrieveFolderContents({ folder: payload.path, id: payload.userId })),

                catchError((error: any) => {
                    this.toastrService.error(error)
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
            break
            case 1: {
                type = payload.entities.length === 1 
                    ? NotificationTypes.DeleteFile 
                    : NotificationTypes.DeleteFiles
                    
                title = `${payload.entities.length === 1 ? "file" : "files"} deleted`
                options = {
                    deleteContext: payload.entities
                }
            }
            break
            case 2: {
                type = NotificationTypes.FileDownloaded
                title = 'file downloaded'
                options = {
                    fileName: payload.name
                }
            }
            break
            case 3: {
                type = NotificationTypes.AddToFavorites
                title = 'file added to favorites'
                options = {
                    fileName: payload.name
                }
            }
            break
            case 4: {
                type = NotificationTypes.RenameEntity
                title = `${payload.entity.oldName} has been renamed to ${payload.entity.newName}`
                options = {
                    fileName: payload.entity.newName
                }
            }
            break
        }

        const result = {
            id: uuid.v4(),
            userId: payload.userId,
            title: title,
            notificationType: type,
            createdOn: new Date(),
            options: options,
        }

        this.store$.dispatch(createNewNotification(result))

    }

}