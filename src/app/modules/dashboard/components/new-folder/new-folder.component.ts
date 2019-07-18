import { Component, OnInit, Inject, isDevMode } from '@angular/core';
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
  public userName: string;
  public shareName: string;
  public mode: number = 0;

  public get inviteeControls(): any {
    return this.newFolderForm.controls['Invitees'].value;
  }

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<NewFolderComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userName = this.data.userName;
    this.newFolderForm = this.initializeNewFolderForm();
    this.inviteeFormArray = <FormArray>this.newFolderForm.controls['Invitees'];
  }

  public get form() {
    return this.newFolderForm.value;
  }
  ngOnInit() {
    this.reactToControlChanges(this.newFolderForm.controls['FolderName']);
  }

  private reactToControlChanges(control: AbstractControl): void {
    control.valueChanges.subscribe((publicLink: string) => {
      this.shareName = publicLink.replace(/[^a-zA-Z0-9]+/ig, '-').toLowerCase();
    })
  }

  public saveAndClose(): void {
    this.newFolderForm.get('FolderName').setValue(this.shareName);
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

  private initializeNewFolderForm(): FormGroup {
    return this.formBuilder.group({
      FolderName: [''],
      Type: ['Folder'],
      Accessibility: [0],
      Invitees: this.formBuilder.array([
        this.initializeInvitees('')
      ])
    });
  }

  public checkDevMode(): string {
    return isDevMode() ? 'http://localhost:4200' : 'https://shareily.com';
  }
}
