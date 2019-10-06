import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of, defer } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { exhaustMap, catchError, tap, map, switchMap, mergeMap } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AppState } from '@/reducers';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpAuthService } from '@/core/http/auth.http.service';
import { HttpRepoService } from '@/core/http/repo.http.service';

import * as auth from '@/core/authentication/store/actions/authentication.actions';

import { isPlatformBrowser, isPlatformServer } from '@angular/common';


@Injectable()
export class AuthenticationEffects {

    constructor(private actions$: Actions, private authService: HttpAuthService, private store$: Store<AppState>, private toastrService: ToastrService, private router: Router, private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object) { }

    @Effect()
    public registerUserRequested$: Observable<Action> = this.actions$.pipe(
        ofType(auth.AuthenticationActionTypes.RegisterUserRequested),

        exhaustMap((action: any): Observable<any> => {

            return this.authService.register(action.payload.user).pipe(

                map((payload: any): Action => new auth.RegistrationSuccessful(payload)),

                catchError((error: any): Observable<Action> => of(new auth.RegistrationUnsuccessful({ error: error })))

            )
        })
    );

    @Effect()
    public authenticateUserRequested$: Observable<Action> = this.actions$.pipe(
        ofType(auth.AuthenticationActionTypes.AuthenticateUserRequested),
        exhaustMap((action: any) => {
            return this.authService.login(action.payload.account).pipe(

                map((payload: any) => new auth.AuthenticateUserSuccessful({ token: payload })),

                tap((user: any) => this.router.navigateByUrl('/dashboard/main')),

                catchError((err: any) => of(new auth.AuthenticateUserUnsuccessful({ error: err })))

            )
        })

    );

    @Effect({ dispatch: false })
    public userLogout$ = this.actions$.pipe(
        ofType(auth.AuthenticationActionTypes.LogoutUserRequested),
        exhaustMap((action: any) => {
            return this.authService.logout().pipe(
                tap(() => {
                    if (isPlatformBrowser(this.platformId)) {
                        // Client only code.
                        localStorage.removeItem('Account');
                        this.router.navigate(['/login'], { replaceUrl: true }); //, { relativeTo: this.route }
                        this.toastrService.success("You have successfully logged out");
                    }
                }),
                catchError((error: any) => {
                    this.toastrService.error(error);
                    return error;
                })
            )
        })
    )

    @Effect({ dispatch: false })
    registrationUnsuccessful$ = this.actions$.pipe(
        ofType(auth.AuthenticationActionTypes.RegistrationUnsuccessful),
        tap((action: any) => {
            this.toastrService.error(action.payload.error);
        })
    );

    @Effect({ dispatch: false })
    registrationSuccessful$ = this.actions$.pipe(
        ofType(auth.AuthenticationActionTypes.RegistrationSuccessful),
        tap(() => {
            this.toastrService.success('Registration was successsful, you may now log in');
            this.router.navigateByUrl('/login');
        })
    );

    @Effect({ dispatch: false })
    authenticationUnsuccessful$ = this.actions$.pipe(
        ofType(auth.AuthenticationActionTypes.AuthenticateUserUnsuccessful),
        tap((action: any) => {
            this.toastrService.error(action.payload.error);
        })
    );

    @Effect({ dispatch: false })
    authenticationSuccessful$ = this.actions$.pipe(
        ofType(auth.AuthenticationActionTypes.AuthenticateUserSuccessful),
        tap((action: any) => {
            if (isPlatformBrowser(this.platformId)) {
                // Client only code.
                localStorage.setItem('Account', JSON.stringify(action.payload.token))
            }
        })
    );

    @Effect()
    public init$ = defer(() => {

        if (isPlatformBrowser(this.platformId)) {
            // Client only code.
            const account = JSON.parse(localStorage.getItem("Account"));
    
            if (account && account.JWTToken) {
                return of(new auth.AuthenticateUserSuccessful({ token: account }));
            }
            // else {
            //     return <any> of(new LogoutUserRequested());
            // }
        }


    })


}