import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { VerifyLink } from '../authentication/store/actions/authentication.actions';
import { HttpRepoService } from '../http/repo.http.service';


@Injectable() 
export class LinkVerificationResolver implements Resolve<any> {

    constructor(private store: Store<AppState>, private repoService: HttpRepoService) { }

    resolve(route: ActivatedRouteSnapshot) {

        return this.repoService.verifyLink(route.params);

    }
}