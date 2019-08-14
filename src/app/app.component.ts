import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectUser } from './core/authentication/store/selectors/authentication.selectors';
import { LogoutUserRequested } from './core/authentication/store/actions/authentication.actions';
import { AppState } from './reducers/index';
import { MatSnackBar } from '@angular/material';

import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import * as fromAccount from '@/modules/account/store/actions/account.actions';
import * as fromNotifications from '@/modules/notifications/store/actions/notification.actions';
import * as account from '@/modules/account/store/selectors/account.selectors';

import { Router, ActivatedRoute } from '@angular/router';
import { FileUploadProgressComponent } from './modules/upload-file/components/file-upload-progress/file-upload-progress.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { takeUntil, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  public authState$: Observable<boolean>;
  public initials$: Observable<string>;
  public isXS: boolean = true;
  constructor(private breakpointObserver: BreakpointObserver, private store$: Store<AppState>, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {
    
  }
  ngOnInit(): void {
    
    this.store$.pipe(select(selectUser)).subscribe((result: any) => {

      if (result.isLoggedIn) {
        this.store$.dispatch(new fromAccount.FetchAccountInfo())
        this.store$.dispatch(new fromNotifications.FetchNotifications({ id: result.token.Id }))
      }

      this.authState$ = of(result.isLoggedIn);
    });

    this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadViewState)
    ).subscribe((state: any): void => this.openSnackBar(state))

    this.initials$ = this.store$.pipe(
      select(account.selectAccountInfo),
      map((account: any) => {
        if (Object.keys(account).length > 1) {
          return this.getInitialsFromAccountData(account);
        }
      })
    )

    this.observeBreakpointChanges()
  }

  public logout(): void {
    this.store$.dispatch(new LogoutUserRequested());
  }

  private openSnackBar(state: boolean): void {
    if (state) {
      this.snackBar.openFromComponent(FileUploadProgressComponent);
    } else {
      this.snackBar.dismiss()
    }
  }
  
  public navigate(route: string): void {
    this.router.navigate([route], { relativeTo: this.route });
  }

  private getInitialsFromAccountData(account: any): string {
    let initials: string = ""

    if (account.FirstName && account.LastName) {
      const fullName: string[] = `${account.FirstName} ${account.LastName}`.split(" ")
      initials = `${fullName[0][0]}${fullName[1][0]}`
      return initials;
    }
    else {
      initials = account.UserName[0]
    }


    return initials
  }


  private observeBreakpointChanges(): void {
    this.breakpointObserver
      .observe(['(max-width: 350px'])
      // .pipe(
      //   takeUntil(this.authState$)
      // )
      .subscribe((result: BreakpointState) => this.isXS = result.matches)
  }

}
