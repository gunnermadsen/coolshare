import { Component, OnInit, isDevMode, OnDestroy } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { getRepoData } from '../../store/selectors/dashboard.selectors';
import { Observable, Subject } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';
import * as favorites from '../../store/actions/filesystem.actions';
import { Update } from '@ngrx/entity';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit, OnDestroy {

  public userId: string
  public isXS: boolean = true
  public userName: string
  public cwd: string
  public path: string[] = []
  public files$: Observable<any>
  public isFavorites: boolean = false
  public isFiles: boolean = false
  private server: string

  private destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private store$: Store<AppState>, private breakpointObserver: BreakpointObserver) {
    const account = JSON.parse(localStorage.getItem('Account'));
    this.userId = account.Id;
    this.userName = account.UserName;

    this.server = isDevMode() ? 'http://localhost:3000' : 'https://portfolioapis.herokuapp.com'
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px)']).pipe(takeUntil(this.destroy$)).subscribe((state: BreakpointState) => {
      return state.matches ? this.isXS = true : this.isXS = false;
    })

    this.files$ = this.store$.pipe(
      select(getRepoData), 
      tap((result: any[]) => {
        if (result.length) {

          this.cwd = result[0].Cwd;
          let favoriteState = result.filter((file: any) => file.IsFavorite)

          if (favoriteState.length) {
            this.isFavorites = true
          }

          this.isFiles = true

        }
        return result;
      }),
      map((files: any[]) => files.sort((a: any, b: any) => new Date(a.CreatedOn).getTime() - new Date(b.CreatedOn).getTime()))
    )
  }

  public editFavoriteStatus(entity: any): void {

    const payload: Update<any> = {
      id: entity.Id,
      changes: { IsFavorite: !entity.IsFavorite }
    }

    this.store$.dispatch(new favorites.ModifyFavorites({ entity: payload, userId: this.userId }))
  }

  public setResource(path: string): string {
    return this.server + path
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}