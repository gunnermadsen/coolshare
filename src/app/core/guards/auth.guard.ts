import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/reducers';
import { userAuthenticationStatus } from '../authentication/store/selectors/authentication.selectors';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private store: Store<AppState>) { }

  canActivate(): Observable<boolean> {
    
    return this.store.pipe(
      select(userAuthenticationStatus), 
      take(1), 
      tap((state) => {
        if (!state) {
          this.router.navigateByUrl('/login');
          return false;
        }
        else {
          return true;
        }
      })
    )
  }
}
