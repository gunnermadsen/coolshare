import { Injectable } from '@angular/core';
import { Observable, of, defer } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RegisterUserRequested, AuthenticationActionTypes, RegistrationUnsuccessful, AuthenticateUserRequested, AuthenticateUserUnsuccessful, AuthenticateUserSuccessful, RegistrationSuccessful, LogoutUserRequested } from '../actions/authentication.actions';
import { exhaustMap, catchError, tap, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppState } from 'src/app/reducers';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Injectable()
export class AuthenticationEffects {

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<AppState>, private toastrService: ToastrService, private router: Router) { }

    @Effect() init$ = defer(() => {
        const token = JSON.parse(localStorage.getItem("Token"));
        if (token) {
            return of(new AuthenticateUserSuccessful({ user: token }));
        }
        else {
            return of(new LogoutUserRequested());
        }
    })

    @Effect() 
    registerUserRequested$ = this.actions$.pipe(
        ofType<RegisterUserRequested>(AuthenticationActionTypes.RegisterUserRequested),
        exhaustMap((action: any) => {
            return this.http.post<any>('/api/register', action.payload.user)
        }),
        switchMap((result) => [
            this.store.dispatch(new RegistrationSuccessful(result))
        ]),
        catchError((err: any) => {
            return of(this.store.dispatch(new RegistrationUnsuccessful({ error: err.error.message })))
        })
    );

    @Effect() 
    authenticateUserRequested$ = this.actions$.pipe(
        ofType<AuthenticateUserRequested>(AuthenticationActionTypes.AuthenticateUserRequested),
        exhaustMap((action: any) => {
            return this.http.post<any>('/api/login', action.payload.user)
        }),
        switchMap((action) => [
            this.store.dispatch(new AuthenticateUserSuccessful(action.payload.token))
        ]),
        catchError((err: any) => {
            return of(this.store.dispatch(new AuthenticateUserUnsuccessful({ error: err })))
        })
    );

    @Effect({ dispatch: false }) 
    registrationUnsuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<RegistrationUnsuccessful>(AuthenticationActionTypes.RegistrationUnsuccessful),
        tap((action: any) => {
            this.toastrService.error(action.payload.error);
        })
    );

    @Effect({ dispatch: false }) 
    registrationSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<RegistrationSuccessful>(AuthenticationActionTypes.RegistrationSuccessful),
        tap(() => {
            this.toastrService.success('Registration was successsful, you may now log in');
            this.router.navigateByUrl('/login');
        })
    );

    @Effect({ dispatch: false }) 
    authenticationUnsuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<AuthenticateUserUnsuccessful>(AuthenticationActionTypes.AuthenticateUserUnsuccessful),
        tap((action: any) => {
            this.toastrService.error(action.payload.error.message);
        })
    );

    @Effect({ dispatch: false }) 
    authenticationSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<AuthenticateUserSuccessful>(AuthenticationActionTypes.AuthenticateUserSuccessful),
        tap((token: any) => {
            localStorage.setItem('Token', JSON.stringify(token));
            this.router.navigateByUrl('/dashboard/main');
        })
    );

    @Effect({ dispatch: false }) 
    useLogout$ = this.actions$.pipe(
        ofType<LogoutUserRequested>(AuthenticationActionTypes.LogoutUserRequested),
        tap(() => {
            localStorage.removeItem('Token');
            this.router.navigate(['/login'], { replaceUrl: true }); //, { relativeTo: this.route }
            this.toastrService.success("You have successfully logged out");
        })
    )

    
}