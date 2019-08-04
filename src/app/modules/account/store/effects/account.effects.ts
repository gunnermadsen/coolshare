import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromAccountActions from '@/modules/account/store/actions/account.actions';
import { exhaustMap, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { AccountService } from '../../service/account.service';
import { ToastrService } from 'ngx-toastr';



@Injectable()
export class AccountEffects {

    @Effect({ dispatch: false }) 
    public updateProfile$ = this.actions$.pipe(
        ofType(fromAccountActions.AccountActionTypes.UpdateProfile),
        exhaustMap((action: any) => {
            return this.accountService.updateProfile(action.payload.profile, action.payload.id).pipe(
                tap((payload: any) => {
                    this.toastrService.success(payload.message);
                }),
                catchError((error: any) => {
                    return throwError(error)
                })
            )
        })
    );

    @Effect({ dispatch: false }) 
    public updatePicture$ = this.actions$.pipe(
        ofType(fromAccountActions.AccountActionTypes.UpdatePicture),
        exhaustMap((action: any) => {
            return this.accountService.updatePicture(action.payload.picture).pipe(
                tap((payload: any) => {
                    this.toastrService.success(payload.message);
                }),
                catchError((error: any) => {
                    this.toastrService.error(error);
                    return throwError(error)
                })
            )
        })
    );

    @Effect()
    public getAccountInfo$ = this.actions$.pipe(
        ofType(fromAccountActions.AccountActionTypes.FetchAccountInfo),
        mergeMap((action: any) => {
            return this.accountService.fetchAccountInfo().pipe(
                map((payload: any) => {
                    return new fromAccountActions.SaveAccountInfo(payload.account);
                }),
                catchError((error: any) => {
                    return throwError(error);
                })
            )
        })
    )

    constructor(private actions$: Actions, private accountService: AccountService, private toastrService: ToastrService) { }
}