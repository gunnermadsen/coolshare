import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppState } from '../../reducers/index';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private store: Store<AppState>) { }

  canActivate(): boolean {

    const account = JSON.parse(localStorage.getItem('Account'))
    
    if (account && account.JWTToken) {
      return true;
    }
    else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
