import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FileSystemActionTypes, RetrieveFolderContents, SaveRetrievedFolderContents } from '../actions/filesystem.actions';
import { exhaustMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileSystemEffects {

    @Effect() 
    retrieveFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType<RetrieveFolderContents>(FileSystemActionTypes.RetrieveFolderContents),
        exhaustMap(() => {
            return this.http.get<any>('/api/repo');
        }),
        map((folder) => {
            return new SaveRetrievedFolderContents({ contents: folder });
        })

    )

    constructor(private actions$: Actions, private http: HttpClient) {}
}