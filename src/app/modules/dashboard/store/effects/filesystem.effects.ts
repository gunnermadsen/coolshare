import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FileSystemActionTypes, RetrieveFolderContents, SaveRetrievedFolderContents } from '../actions/filesystem.actions';
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpRepoService } from '@/core/http/repo.http.service';

@Injectable()
export class FileSystemEffects {

    @Effect() 
    retrieveFolderContents$: Observable<Action> = this.actions$.pipe(
        ofType<RetrieveFolderContents>(FileSystemActionTypes.RetrieveFolderContents),
        mergeMap(() => {
            return this.repoService.getFolderContents();
        }),
        map((folder) => {
            return new SaveRetrievedFolderContents({ contents: folder });
        })

    )

    constructor(private actions$: Actions, private repoService: HttpRepoService) {}
}