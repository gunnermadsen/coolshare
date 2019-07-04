import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.less']
})
export class NewFolderComponent implements OnInit {

  public newFolderForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<NewFolderComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  public get form() {
    return this.newFolderForm.value;
  }
  ngOnInit() {
    this.newFolderForm = this.formBuilder.group({
      FolderName: [''],
      Accessability: [0]
    })
  }

  public saveAndClose(): void {
    this.dialogRef.close(this.form);
  }

}
