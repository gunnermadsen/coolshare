import { Injectable } from '@angular/core';
import { Observable, of, defer } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RegisterUserRequested, AuthenticationActionTypes, RegistrationUnsuccessful, AuthenticateUserRequested, AuthenticateUserUnsuccessful, AuthenticateUserSuccessful, RegistrationSuccessful, LogoutUserRequested, VerifyLink } from '../actions/authentication.actions';
import { exhaustMap, catchError, tap, map, switchMap, mergeMap } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AppState } from '@/reducers';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpAuthService } from '@/core/http/auth.http.service';
import { HttpRepoService } from '@/core/http/repo.http.service';
import { SaveRetrievedFolderContents } from '@/modules/dashboard/store/actions/filesystem.actions';


@Injectable()
export class AuthenticationEffects {

    constructor(private actions$: Actions, private authService: HttpAuthService, private repoService: HttpRepoService, private store: Store<AppState>, private toastrService: ToastrService, private router: Router, private route: ActivatedRoute) { }

    @Effect() 
    public registerUserRequested$: Observable<Action> = this.actions$.pipe(
        ofType<RegisterUserRequested>(AuthenticationActionTypes.RegisterUserRequested),

        exhaustMap((action: any): Observable<any> => {

            return this.authService.register(action.payload.user).pipe(

                map((payload: any): Action => {
                    return new RegistrationSuccessful(payload);
                }),

                catchError((err: any): Observable<Action> => {
                    return of(new RegistrationUnsuccessful({ error: err.error.message }));
                })
            )
        })
    );

    @Effect() 
    public authenticateUserRequested$ = this.actions$.pipe(
        ofType<AuthenticateUserRequested>(AuthenticationActionTypes.AuthenticateUserRequested),
        exhaustMap((action: any) => {
            return this.authService.login(action.payload.account).pipe(
                map((payload) => {
                    return new AuthenticateUserSuccessful({ account: payload.account });
                }),
                tap((user: any) => {
                    return this.router.navigateByUrl('/dashboard/main');
                }),
                catchError((err: any) => {
                    return of(new AuthenticateUserUnsuccessful({ error: err }));
                })
            )
        }),
        
    );

    @Effect()
    public userLogout$ = this.actions$.pipe(
        ofType<LogoutUserRequested>(AuthenticationActionTypes.LogoutUserRequested),
        switchMap((action: any) => {
            return this.authService.logout().pipe(
                tap(() => {
                    localStorage.removeItem('Account');
                    this.router.navigate(['/login'], { replaceUrl: true }); //, { relativeTo: this.route }
                    this.toastrService.success("You have successfully logged out");
                }),
                catchError((err: any) => {
                    return of(new AuthenticateUserUnsuccessful({ error: err }));
                })
            )
        }),

    )

    @Effect({ dispatch: false }) 
    registrationUnsuccessful$ = this.actions$.pipe(
        ofType<RegistrationUnsuccessful>(AuthenticationActionTypes.RegistrationUnsuccessful),
        tap((action: any) => {
            this.toastrService.error(action.payload.error);
        })
    );

    @Effect({ dispatch: false }) 
    registrationSuccessful$ = this.actions$.pipe(
        ofType<RegistrationSuccessful>(AuthenticationActionTypes.RegistrationSuccessful),
        tap(() => {
            this.toastrService.success('Registration was successsful, you may now log in');
            this.router.navigateByUrl('/login');
        })
    );

    @Effect({ dispatch: false }) 
    authenticationUnsuccessful$ = this.actions$.pipe(
        ofType<AuthenticateUserUnsuccessful>(AuthenticationActionTypes.AuthenticateUserUnsuccessful),
        tap((action: any) => {
            this.toastrService.error(action.payload.error);
        })
    );

    @Effect({ dispatch: false }) 
    authenticationSuccessful$ = this.actions$.pipe(
        ofType<AuthenticateUserSuccessful>(AuthenticationActionTypes.AuthenticateUserSuccessful),
        tap((action: any) => {
            localStorage.setItem('Account', JSON.stringify(action.payload.account));
        })
    );

    @Effect()
    public verifyLink$: Observable<Action> = this.actions$.pipe(
        ofType<VerifyLink>(AuthenticationActionTypes.VerifyLink),
        mergeMap((action: any) => {
            return this.repoService.verifyLink(action.payload.link).pipe(
                map((payload: any) => {
                    return new SaveRetrievedFolderContents({ contents: payload });
                })
            )
        })
    )

    @Effect()
    init$ = defer(() => {
        const account = JSON.parse(localStorage.getItem("Account"));

        if (account && account.Token) {
            return of(new AuthenticateUserSuccessful({ account: account }));
        } 
        // else {
        //     return <any> of(new LogoutUserRequested());
        // }
        
    })

     
}