import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@/reducers';
import * as AccountActions from '@/modules/account/store/actions/account.actions';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public signinForm: FormGroup;

  public id: string;

  public submitted: boolean = false;

  public get form() {
    return this.signinForm.controls;
  }

  constructor(private formBuilder: FormBuilder, private store$: Store<AppState>) {
    this.id = JSON.parse(localStorage.getItem('Account')).Id;

  }

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      OldPassword: [''],
      NewPassword: [''],
      ConfirmPassword: ['']
    })
  }

  public updatePassword(): void {
    this.submitted = true;

    if (this.signinForm.invalid) {
      return;
    }

    const profile = {
      password: this.form.ProfilePicture.value
    }

    this.store$.dispatch(AccountActions.updatePasswordAction({ profile: profile, id: this.id }));
  }

}
