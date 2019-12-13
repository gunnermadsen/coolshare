import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@/reducers';
import { InvalidCharacterValidator } from '@/shared/validators/invalid-characters.validator';
import { authenticateUserRequested } from '@/core/authentication/store/actions/authentication.actions';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public loading: boolean = false;
  public submitted: boolean = false;
  public returnUrl: string;
  constructor(private formBuilder: FormBuilder, private store: Store<AppState>) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      UserName: ['madgunner', Validators.compose([ Validators.required, InvalidCharacterValidator ])],
      Password: ['Megatron1!', Validators.compose([ Validators.required, InvalidCharacterValidator ])]
    });
  }

  public get f() {
    return this.loginForm.value;
  }

  public get c() {
    return this.loginForm.controls;
  }

  public onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(authenticateUserRequested({
      account: {
        UserName: this.f.UserName,
        Password: this.f.Password
      } 
    }));
  }

  public getErrorMessage(control: string, error: string): string {
    let message: string;
    switch(error) {
      case 'required': {
        message = `${control} is required`;
        break;
      }
      case 'invalidCharacters': {
        message = 'You are entering invalid characters. <>^*?+=[]{}"\'|\/= are not allowed';
        break;
      }
    }
    return this.loginForm.controls[control].hasError(error) ? message : '';
  }
}
