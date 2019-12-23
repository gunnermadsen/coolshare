import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IFile } from '@/shared/models/file.model';

@Component({
  selector: 'entity-info-dialog',
  templateUrl: './entity-info-dialog.component.html',
  styleUrls: ['./entity-info-dialog.component.less']
})
export class EntityInfoDialogComponent implements OnInit {
  public entities: IFile[]

  public userName: string
  public invitees: string[]
  public permissionOptions = ["READONLY", "READWRITE", "FULLACCESS"]

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<EntityInfoDialogComponent>) { }

  ngOnInit() {
    this.entities = this.data.entities
    this.userName = this.data.userName
    if (this.entities.length === 1) {
      this.invitees = this.configureMemberList(this.entities[0].Meta, this.entities[0].IsShared)
    }
  }

  private configureMemberList(meta: any | null, state: boolean): string[] {
    if (state) {
      return meta.invitees
    } else {
      return [this.userName]
    }
    // return state ? meta.invitees : [ this.userName ]
  }

  public closeDialog(): void {
    this.dialogRef.close()
  }

}