import { Component, OnInit, isDevMode, OnDestroy, Inject, PLATFORM_ID } from '@angular/core'
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout'
import { Store, select } from '@ngrx/store'
import { AppState } from '@/reducers'
import { getRepoData, getFavorites } from '../../store/selectors/dashboard.selectors'
import { Observable, Subject } from 'rxjs'
import { map, tap, takeUntil, take, filter } from 'rxjs/operators'
import * as filesystem from '../../store/actions/filesystem.actions'
import { Update } from '@ngrx/entity'
import { isPlatformBrowser } from '@angular/common'
import * as path from 'path'
import * as fsSelectors from '../../store/selectors/dashboard.selectors';
import { IFile } from '@/shared/models/file.model'

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
  public recents$: Observable<any>
  public favorites$: Observable<any>
  public suggestions$: Observable<any>
  public isSuggestions: boolean = false
  public isFavorites: boolean = false
  public isRecents: boolean = false
  private server: string
  private destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private store$: Store<AppState>, private breakpointObserver: BreakpointObserver) {
    if (isPlatformBrowser(this.platformId)) {
      const account = JSON.parse(localStorage.getItem('Account'))
      this.userId = account.Id
      this.userName = account.UserName
    }

    this.server = isDevMode() ? 'http://localhost:4200' : 'https://coolshare.herokuapp.com'
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px)']).pipe(takeUntil(this.destroy$)).subscribe((state: BreakpointState) => this.isXS = state.matches)

    this.suggestions$ = this.store$.pipe(
      select(fsSelectors.getSuggestions),
      map((suggestions: IFile[]) => {
        this.isSuggestions = suggestions.length ? true : false
        if (!suggestions.length) {
          return [{ Name: "You have no suggested files to display" }]
        }
        return suggestions
      })
    )

    this.favorites$ = this.store$.pipe(
      select(fsSelectors.getFavorites),
      map((favorites: IFile[]) => {
        this.isFavorites = favorites.length ? true : false
        if (!favorites.length) {
          return [ { Name: "Files or folders that are starred will appear here" } ]
        } 
        return favorites
      })
    )

    this.recents$ = this.store$.pipe(
      select(fsSelectors.getRecents), 
      tap((recents: IFile[]) => {
        this.isRecents = recents.length ? true : false
        if (!recents.length) {
          return [{ Name: "Files that have been uploaded or edited recently will appear here" }]
        }
        this.cwd = recents[0].Cwd
        return recents
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

  public setResource(name: string, type: string): string {
    // const id = JSON.parse(localStorage.getItem('Account')).Id
    switch (type) {
      case "File": {
        const extension = name.split('.')
        return `${this.server}/assets/icons/${extension[extension.length - 1].toLowerCase()}.png`
      } 
      case "Folder": {
        return `${this.server}/assets/icons/folder-24.png`
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}