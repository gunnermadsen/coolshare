import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges, isDevMode } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { of, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Permission } from '@/shared/models/permissions.enum'
import { IFile } from '@/shared/models/file.model';


@Component({
  selector: 'entity-info',
  templateUrl: './entity-info.component.html',
  styleUrls: ['./entity-info.component.less']
})
export class EntityInfoComponent implements OnChanges, OnInit {

  @Input() 
  public entities: any

  @Input()
  public userName: string

  @Input()
  public isSelected: boolean = false

  // public isShared: boolean = false
  public displayedColumns: string[] = ['name', 'permission']

  
  public dataSource$: Observable<{ name: string, access: string }>
  public entity: IFile
  public extension: string
  public permissions: any
  private server: string

  constructor() {
    this.server = isDevMode() ? 'http://localhost:4200' : 'https://coolshare.herokuapp.com'

  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.entities.length === 1) {
      this.entity = this.entities[0]
      this.extension = this.getFileType(this.entity.Name, this.entity.Type)
      this.permissions = this.configurePermissionData(this.entity.Meta)
    }

    this.dataSource$ = this.configureDataSource()

    // this.isShared = this.entities.length ? true : false
  }

  ngOnInit() {}

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

  private configureDataSource(): Observable<{ name: string, access: string }> {
    return of(this.entities).pipe(
      map((entities: IFile[]) => {
        if (entities.length) {
          const result = entities.map((entity: IFile) => {
            if (entity.Meta != null) {
              return entity.Meta.invitees.map((invitee: string) => {
                return {
                  name: invitee, //.name,
                  access: entity.Meta.permission //invitee.accessRight 
                }
              })
            }
          })
          return result[0]
        }
      })
    )
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

  public getImageFromPath(mode: number = null): string {
    // '/assets/' + entity.Icon
    const entity = this.entity
    switch (entity.Type) {
      case "File": {
        const extension = entity.Name.split('.')
        let url = `${this.server}/assets/icons/${extension[extension.length - 1].toLowerCase()}.png`
        if (mode) {
          return `url(${url}), url(${this.server}/assets/icons/file-13.png)`
        }
        return url
      }
      case "Folder": {
        const url = `${this.server}/assets/${entity.IsShared ? 'share-folder' : 'folder'}.png`
        if (mode) {
          return `url(${url})`
        }
        return url
      }
    }
  }
}