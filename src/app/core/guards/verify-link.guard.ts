import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { VerifyLink } from '../authentication/store/actions/authentication.actions';
import { HttpRepoService } from '../http/repo.http.service';
import { ToastrService } from 'ngx-toastr';


@Injectable() 
export class LinkVerificationResolver implements Resolve<any> {

    constructor(private store: Store<AppState>, private repoService: HttpRepoService, private toastrService: ToastrService) { }

    resolve(route: ActivatedRouteSnapshot) {

        return this.repoService.verifyLink(route.params).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error: any) => {
                return of({ content: null, message: error.message })
            })
        );

    }
}