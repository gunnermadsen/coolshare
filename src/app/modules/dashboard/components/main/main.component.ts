import { Component, OnInit, isDevMode, OnDestroy, Inject, PLATFORM_ID } from '@angular/core'
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout'
import { Store, select } from '@ngrx/store'
import { AppState } from '@/reducers'
import { getRepoData } from '../../store/selectors/dashboard.selectors'
import { Observable, Subject } from 'rxjs'
import { map, tap, takeUntil, take, filter } from 'rxjs/operators'
import * as filesystem from '../../store/actions/filesystem.actions'
import { Update } from '@ngrx/entity'
import { isPlatformBrowser } from '@angular/common'


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
  public favorites$: Observable<any>
  public suggestions$: Observable<any>
  public isSuggestions: boolean = false
  public isFavorites: boolean = false
  public isFiles: boolean = false
  private server: string
  private destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private store$: Store<AppState>, private breakpointObserver: BreakpointObserver) {
    if (isPlatformBrowser(this.platformId)) {
      const account = JSON.parse(localStorage.getItem('Account'))
      this.userId = account.Id
      this.userName = account.UserName
    }

    this.server = isDevMode() ? 'http://localhost:3000' : 'https://portfolioapis.herokuapp.com'
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px)']).pipe(takeUntil(this.destroy$)).subscribe((state: BreakpointState) => this.isXS = state.matches)

    this.favorites$ = this.store$.pipe(
      select(getRepoData),
      map((result: any) => result.filter((file: any) => file.IsFavorite)),
      map((result: any) => {
        if (!result.length) {
          this.isFavorites = false
          return [ { Name: "Files or folders that are starred will appear here" } ]
        } 
        this.isFavorites = true
        return result
      })
    )

    this.files$ = this.store$.pipe(
      select(getRepoData), 
      tap((result: any[]) => {
        if (result.length) {
          this.cwd = result[0].Cwd
          this.isFiles = true
        }
        return result
      }),
      map((files: any[]) => files.sort((a: any, b: any) => new Date(a.CreatedOn).getTime() - new Date(b.CreatedOn).getTime()))
    )

    this.suggestions$ = this.store$.pipe(
      map((suggestions: any[]) => suggestions.filter((suggestion: any) => new Date(suggestion.CreatedOn) >= new Date(Date.now() - 500000000))),
      map((suggestions: any[]) => {
        if (!suggestions.length) {
          this.isSuggestions = false
          return [ { Name: "You have no suggested files to display" } ]
        }
        this.isSuggestions = true
        return suggestions
      })
    )
  }

  public editFavoriteStatus(entity: any): void {

    const payload: Update<any> = {
      id: entity.Id,
      changes: { IsFavorite: !entity.IsFavorite }
    }

    this.store$.dispatch(filesystem.updateFavoriteStatus({ entity: payload, userId: this.userId }))
  }

  public setResource(path: string): string {
    return this.server + path
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}