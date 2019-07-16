import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { getRepoData } from '../../store/selectors/dashboard.selectors';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  public isXS: boolean = true;
  public cwd: string;
  public path: string[] = [];
  public files$: Observable<any>;


  constructor(private store$: Store<AppState>, private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px']).subscribe((state: BreakpointState) => {
      return state.matches ? this.isXS = true : this.isXS = false;
    })

    this.files$ = this.store$.pipe(
      select(getRepoData), 
      tap((result: any) => {
        if (result.length) {
          this.cwd = result[0].cwd;
        }
        return result;
      }),
      map((contents: any[]) => {
        return contents.sort((a: any, b: any) => b.creationDate - a.creationDate)
      })
    )
  }
}
