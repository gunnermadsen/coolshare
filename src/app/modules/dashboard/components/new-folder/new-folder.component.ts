import { Component, OnInit, Inject, isDevMode, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { take, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
  selector: 'new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.less']
})
export class NewFolderComponent implements OnInit, OnDestroy {

  public newFolderForm: FormGroup
  public inviteeFormArray: FormArray
  public userName: string
  public shareName: string
  public mode: number = 0
  public permissions: any[] = []
  private destroy$: Subject<boolean> = new Subject<boolean>()

  public get inviteeControls(): any {
    return this.newFolderForm.controls['Invitees'].value
  }

  public get inviteeCount(): number {
    return this.newFolderForm.value.Invitees.length
  }

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<NewFolderComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userName = this.data.userName
    this.newFolderForm = this.initializeNewFolderForm()
    this.inviteeFormArray = <FormArray>this.newFolderForm.controls['Invitees']
  }

  public get form() {
    return this.newFolderForm.value
  }
  ngOnInit() {
    this.reactToControlChanges(this.newFolderForm.controls['FolderName'])

    this.permissions = [
      { type: "Read Only", subtitle: "Invitees are limited to viewing files" }, 
      { type: "Read and Write", subtitle: "Invitees can view and modify files" },
      { type: "Full Access", subtitle: "Invitees have complete control over all files" }
    ]
  }

  private reactToControlChanges(control: AbstractControl): void {
    control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((publicLink: string) => {
      this.shareName = publicLink.replace(/[^a-zA-Z0-9]+/ig, '-').toLowerCase()
    })
  }

  public saveAndClose(): void {
    this.newFolderForm.get('ShareName').setValue(this.shareName)
    this.dialogRef.close(this.form)
  }

  public setMode(event): void {
    this.mode = event.value
  }

  public initializeInvitees(invitee: string): AbstractControl {
    return this.formBuilder.control(invitee)
  }

  public addInvitee(invitee: any): void {
    this.inviteeFormArray.push(this.initializeInvitees(invitee))
  }

  public removeInvitee(): void {
    this.inviteeFormArray.removeAt(this.inviteeCount - 1)
  }

  public trackByFn<T, V>(index: T, item: V): T | V {
    return index
  }

  private initializeNewFolderForm(): FormGroup {
    return this.formBuilder.group({
      FolderName: [''],
      ShareName: [''],
      Type: ['Folder'],
      Accessibility: [0],
      Permissions: [0],
      Invitees: this.formBuilder.array([
        this.initializeInvitees('')
      ]),
      LockPermissions: [false]
    })
  }

  public checkDevMode(): string {
    return isDevMode() ? 'http://localhost:4200' : 'https://shareily.com'
  }

  public ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }
}
