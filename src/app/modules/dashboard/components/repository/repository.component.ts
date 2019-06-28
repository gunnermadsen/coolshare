import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { getRepoData } from '../../store/selectors/dashboard.selectors';
import { Observable, merge } from 'rxjs';
import { MatPaginator, MatSort } from '@angular/material';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.less']
})
export class RepositoryComponent implements OnInit, AfterViewInit {
  public repo$: Observable<any>;

  public data: any;
  public displayedColumns: string[] = ['name', 'createdDate', 'members', 'action'];

  @ViewChild(MatPaginator, { static: false }) 
  public paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) 
  public sort: MatSort;
  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.pipe(select(getRepoData)).subscribe((repo: any) => this.data = repo);
  }

  ngAfterViewInit() {
    // this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.exampleDatabase!.getRepoIssues(
    //         this.sort.active, this.sort.direction, this.paginator.pageIndex);
    //     }),
    //     map(data => {
    //       // Flip flag to show that loading has finished.
    //       this.isLoadingResults = false;
    //       this.isRateLimitReached = false;
    //       this.resultsLength = data.total_count;

    //       return data.items;
    //     }),
    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       // Catch if the GitHub API has reached its rate limit. Return empty data.
    //       this.isRateLimitReached = true;
    //       return observableOf([]);
    //     })
    //   ).subscribe(data => this.data = data);
  }

}
