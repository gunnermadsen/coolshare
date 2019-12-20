import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'entity-info',
  templateUrl: './entity-info.component.html',
  styleUrls: ['./entity-info.component.less']
})
export class EntityInfoComponent implements OnInit {

  public entity: any
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.entity = this.data
  }

  ngOnInit() {

  }

}
