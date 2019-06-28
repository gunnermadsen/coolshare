import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FileSystemActionTypes, RetrieveFolderContents, SaveRetrievedFolderContents } from '../actions/filesystem.actions';
import { exhaustMap, map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpRepoService } from '@/core/http/repo.http.service';

@Injectable()
export class FileSystemEffects {

    constructor(private actions$: Actions, private repoService: HttpRepoService) { }

    @Effect() 
    public retrieveFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType<RetrieveFolderContents>(FileSystemActionTypes.RetrieveFolderContents),
        mergeMap((action: any) => {
            return this.repoService.getFolderContents(action.payload.folder);
        }),
        map((folder: any) => {
            return new SaveRetrievedFolderContents({ contents: folder });
        }),
        catchError(error => {
            of(error)
            return throwError(error)
        })

    )

}