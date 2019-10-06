import { Component, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectUser } from './core/authentication/store/selectors/authentication.selectors';
import { LogoutUserRequested } from './core/authentication/store/actions/authentication.actions';
import { AppState } from './reducers/index';
import { MatSnackBar, MatSidenav } from '@angular/material';

import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import * as fromAccount from '@/modules/account/store/actions/account.actions';
import * as account from '@/modules/account/store/selectors/account.selectors';
import * as notifications from './modules/notifications/store/selectors/notification.selectors';
import * as notificationSettings from './modules/notifications/store/actions/settings.actions';

import { Router, ActivatedRoute } from '@angular/router';
import { FileUploadProgressComponent } from './modules/upload-file/components/file-upload-progress/file-upload-progress.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { takeUntil, map, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

import { NotificationTypes } from './modules/notifications/store/state';
import { isPlatformBrowser } from '@angular/common';
import { fetchNotifications } from '@/modules/notifications/store/actions/notification.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  public authState$: Observable<boolean>
  public initials$: Observable<string>
  public notifications$: Observable<any>
  public viewState$: Observable<boolean> //= of(true)
  private viewState: boolean
  public isEmpty: boolean = true
  public isXS: boolean = true
  public isSM: boolean = null
  public userId: string = ""
  public mode: string
  @ViewChild('notificationSidenav', { static: true }) public notificationsSidebar: MatSidenav

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private breakpointObserver: BreakpointObserver, private store$: Store<AppState>, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {
    this.initializeNotifications()
  }
  ngOnInit(): void {
    
    this.store$.pipe(select(selectUser)).subscribe((result: any) => {
      if (result.isLoggedIn) {

        if (isPlatformBrowser(this.platformId)) {
          // Client only code.
          this.userId = JSON.parse(localStorage.getItem('Account')).Id
        }

        this.store$.dispatch(new fromAccount.FetchAccountInfo())
        this.store$.dispatch(fetchNotifications({ id: result.token.Id }))
      }
      this.authState$ = of(result.isLoggedIn)
    });

    this.store$.pipe(select(fromFileUploadSelectors.selectUploadViewState)).subscribe((state: any) => this.openSnackBar(state))

    this.initials$ = this.store$.pipe(
      select(account.selectAccountInfo),
      // takeUntil(this.authState$),
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
    this.authState$ = of(false)
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
    this.breakpointObserver.observe(
      ['(max-width: 500px)', '(min-width: 600px)', '(min-width: 750px)']
    )
    .subscribe((result: BreakpointState) => {
      this.isXS = result.breakpoints['(max-width: 550px)'];
      this.isSM = result.breakpoints['(min-width: 600px)']

      this.mode = result.breakpoints['(min-width: 750px)'] ? 'side' : 'over'
      
    })
  }

  private initializeNotifications(): void {
    this.viewState$ = this.store$.pipe(
      select(notifications.selectViewState),
      // takeUntil(this.authState$),
      tap((result: any) => {
        this.viewState = result
        return result;
      })
    )

    this.notifications$ = this.store$.pipe(
      select(notifications.selectAllNotifications),
      // takeUntil(this.authState$),
      map((state: any[]) => {
        if (!state.length) {
          return [{
            title: 'No notifications at this time',
            type: NotificationTypes.Default
          }]
        }
        this.isEmpty = false
        return state
      })
    )
  }

  private initializeAccount(result: any): void {
    

  }

  public closeSidenav($event: any): void {
    this.notificationsSidebar.close()
  }

  public setNotificationViewState(event: MouseEvent): void {
    this.notificationsSidebar.toggle()

    if (!this.viewState) {
      this.store$.dispatch(notificationSettings.setNotificationSettingsViewState({ id: this.userId, notificationBadgeHidden: true }))
    }
  }

}
