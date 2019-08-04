import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';

import * as account from '@/modules/account/store/selectors/account.selectors';

import * as AccountActions from '@/modules/account/store/actions/account.actions';
import { tap, takeUntil } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public profileForm: FormGroup;
  private account: any;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  public submitted: boolean = false;
  public fileType: string;
  public fileSet: boolean;
  public id: string;
  public initials: string;

  public get form() {
    return this.profileForm.controls;
  }


  constructor(private formBuilder: FormBuilder, private store$: Store<AppState>, private toastrService: ToastrService) {
    this.profileForm = this.initializeProfileForm();
    this.id = JSON.parse(localStorage.getItem('Account')).Id;
  }

  public ngOnInit(): void {
    this.store$.pipe(
      select(account.accountSelector),
      takeUntil(this.destroy$)
    ).subscribe((account: any) => {
      if (account) {
        this.account = account;

        this.profileForm.patchValue({
          UserName: account.UserName,
          Email: account.Email,
          FirstName: account.FirstName,
          LastName: account.LastName,
          ProfilePicture: account.ProfilePicture
        });
        
      }
    })
  }

  private initializeProfileForm(): FormGroup {
    return this.formBuilder.group({
      UserName: [''],
      Email: [''],
      FirstName: [''],
      LastName: [''],
      ProfilePicture: ['']
    })
  }

  public uploadProfilePicture(file: File): void {
    if (file) {

      if (file.size / 1000000 >= 5) {
        this.toastrService.warning('Your image exceeds the 5MB file limit. Please select another file.');
        return;
      }

      this.fileType = file.type.split('/').pop();

      if (this.fileType === 'png' || this.fileType === 'jpeg' || this.fileType === 'jpg') {

        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (file: any) => {
          //this.backgroundImage = this.sanitizer.bypassSecurityTrustStyle('url(' + file.target.result + ')');
          // this.croppedImage = event.base64; //this.sanitizer.bypassSecurityTrustStyle('url(' + event.base64 + ')');
          // this.profileForm.get('ProfilePicture').setValue({
          //   filetype: file.type,
          //   value: file.base64.split(',')[1]
          // })
        };

        this.fileSet = true;
        // this.imageChangedEvent = event;

      } else {
        this.toastrService.warning(`${this.fileType} files are not allowed. Please choose a jpeg or png file and try again.`);
      }
    } 
  }

  public saveProfile(): any {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    const profile = {
      UserName: this.form.UserName.value,
      Email: this.form.Email.value,
      FirstName: this.form.FirstName.value,
      LastName: this.form.LastName.value,
      ProfilePicture: this.form.ProfilePicture.value
    }
    
    this.store$.dispatch(new AccountActions.UpdateProfileAction({ profile: profile, id: this.id }));
  }


  public setInitials(): string {

    if (this.account.FirstName && this.account.LastName) {
      
      let initials: string = (this.account.FirstName[0] + this.account.LastName[0]);

      initials = initials.toUpperCase();
  
      return initials;
    } 
    else {
      return this.account.UserName[0].toUpperCase();
    }

  }

  public ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
