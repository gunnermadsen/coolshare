import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { of, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Permission } from '@/shared/models/permissions.enum'


@Component({
  selector: 'entity-info',
  templateUrl: './entity-info.component.html',
  styleUrls: ['./entity-info.component.less']
})
export class EntityInfoComponent implements OnInit {

  public entity: any
  public extension: string
  public permissions: any
  public userName: string
  public invitees: string[]
  public displayedColumns: string[] = ['name', 'permission']
  public permissionOptions = ["READONLY", "READWRITE", "FULLACCESS" ]
  public dataSource$: Observable<any>

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<EntityInfoComponent>) {
    this.entity = this.data.entity
    this.userName = this.data.userName
    this.extension = this.getFileType(this.entity.Name, this.entity.Type)
    this.permissions = this.configurePermissionData(this.entity.Meta)
    this.invitees = this.configureMemberList(this.entity.Meta, this.entity.IsShared)
  }

  ngOnInit() {
    this.dataSource$ = of(this.entity).pipe(
      map((entity: any) => {
        if (entity.Meta != null) {
          return entity.Meta.invitees.map((invitee: string) => {
            return {
              name: invitee,
              access: entity.Meta.permission
            }
          })
        } else {
          return this.configurePermissionData(entity.Meta)
        }
      }),
      tap((entity: any) => console.log(entity))
    )
  }

  public getFileType(name: string, type: string): string {

    switch (type) {
      case "File": {
        const filename = name.split('.')
    
        const extension = filename.pop()
    
        return extension
      }
      case "Folder": {
        return type
      }
    }
  }

  private configurePermissionData(metadata: any): any {
    if (metadata === null) {
      return {
        owner: this.userName
      }
    } else {
      return metadata
    }
  }

  private configureMemberList(meta: any | null, state: boolean): string[] {
    if (state) {
      return meta.invitees
    } else {
      return [ this.userName ]
    }
    // return state ? meta.invitees : [ this.userName ]
  }

  public closeDialog(): void {
    this.dialogRef.close()
  }

  // public getPermissionForUser(name: string): string {
  //   const permission = this.
  // }

}
