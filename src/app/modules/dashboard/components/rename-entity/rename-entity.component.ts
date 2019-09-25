import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'rename-entity',
  templateUrl: './rename-entity.component.html',
  styleUrls: ['./rename-entity.component.less']
})
export class RenameEntityComponent implements OnInit {

  public renameFileForm: FormGroup

  // @ViewChild('fileName', { static: false }) public element: HTMLInputElement

  constructor(@Inject(MAT_DIALOG_DATA) public entity: any, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<RenameEntityComponent>) { }

  public get fileName() {
    return this.renameFileForm.controls['FileName'].value
  }
  ngOnInit() {
    this.renameFileForm = this.formBuilder.group({
      FileName: [this.entity.name]
    })

  }

  public save(): void {
    this.dialogRef.close({ name: this.fileName, changes: true })
  }

}
