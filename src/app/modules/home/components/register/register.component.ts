import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@/reducers';
import { RegisterUserRequested } from '@/core/authentication/store/actions/authentication.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  public registerFormGroup: FormGroup;
  public register: boolean = false;
  public loading: boolean = false;
  public submitted: boolean = false;

  public get f() {
    return this.registerFormGroup.value;
  }

  constructor(private formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit() {
    this.registerFormGroup = this.formBuilder.group({
      Email: ['gunner.madsen@outlook.com', Validators.compose([Validators.required])],
      UserName: ['', Validators.compose([Validators.required])],
      Password: ['Megatron1!', Validators.compose([Validators.required])],
      RepeatPassword: ['Megatron1!', Validators.compose([Validators.required])]
    });
  }

  public onSubmit() {
    if (this.registerFormGroup.invalid) {
      return;
    }

    const user = {
      Email: this.f.Email,
      UserName: this.f.UserName,
      Password: this.f.Password,
    }
    
    this.store.dispatch(new RegisterUserRequested({ user: user }));
  }

  public getErrorMessage(control: string): string {
    return this.registerFormGroup.controls[control].hasError('required') ? `${control} is required` : '';
  }

}
