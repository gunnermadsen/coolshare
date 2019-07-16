import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.less']
})
export class NewFolderComponent implements OnInit {

  public newFolderForm: FormGroup;
  public inviteeFormArray: FormArray;

  public mode: number = 0;

  public get inviteeControls(): any {
    return this.newFolderForm.controls['Invitees'].value;
  }

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<NewFolderComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  public get form() {
    return this.newFolderForm.value;
  }
  ngOnInit() {
    this.newFolderForm = this.formBuilder.group({
      FolderName: [''],
      Accessibility: [0],
      Invitees: this.formBuilder.array([
        this.initializeInvitees('')
      ])
    });

    this.inviteeFormArray = <FormArray>this.newFolderForm.controls['Invitees'];
  }

  public saveAndClose(): void {
    this.dialogRef.close(this.form);
  }

  public setMode(event): void {
    this.mode = event.value;
  }

  public initializeInvitees(invitee: string): AbstractControl {
    return this.formBuilder.control(invitee);
  }

  public addInvitee(invitee: any): void {
    this.inviteeFormArray.push(this.initializeInvitees(invitee))
  }

  public trackByFn<T, V>(index: T, item: V): T | V {
    return index;
  }
}
