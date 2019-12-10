import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { AuthenticationReducer } from '@/core/authentication/store/reducer/authentication.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationEffects } from '@/core/authentication/store/effects/authentication.effects';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
    ],
    imports: [ 
        CommonModule, 
        SharedModule,
        StoreModule.forFeature('Auth', AuthenticationReducer),
        EffectsModule.forFeature([AuthenticationEffects]),
    ],
    exports: [
        LoginComponent,
        RegisterComponent
    ],
    providers: [],
})
export class HomeModule {}