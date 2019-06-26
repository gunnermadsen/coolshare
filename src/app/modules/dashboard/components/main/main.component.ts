import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  public isXS: boolean = true;

  constructor(private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 350px']).subscribe((state: BreakpointState) => {
      return state.matches ? this.isXS = true : this.isXS = false;
    })
  }

}
