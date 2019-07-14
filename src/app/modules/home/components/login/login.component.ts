import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { AuthenticateUserRequested } from '@/core/authentication/store/actions/authentication.actions';
import { selectAuthState } from '@/core/authentication/store/selectors/authentication.selectors';

// import { AlertService } from '@/shared/services/alert.service';
// import { AuthenticationService } from '@/shared/services/authentication.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  returnUrl: string;
  constructor(private formBuilder: FormBuilder, private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      UserName: ['gunner.madsen@outlook.com', Validators.compose([Validators.required]) ],
      Password: ['Megatron1!', Validators.compose([Validators.required])]
    });

    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  public get f() {
    return this.loginForm.value;
  }

  public onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const user = {
      UserName: this.f.UserName,
      Password: this.f.Password
    }

    this.store.dispatch(new AuthenticateUserRequested({ account: user }));

    // this.store.pipe(select(selectAuthState)).subscribe(result => {
    //   if (result) {
    //     this.router.navigateByUrl('/dashboard/main');
    //   }
    // });

  }

  public getErrorMessage(control: string): string {
    return this.loginForm.controls[control].hasError('required') ? `${control} is required` : '';
  }
}
