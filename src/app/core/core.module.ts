import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule }from '@angular/common/http';
import { MaterialModule } from '../shared/material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { URLInterceptorService } from './interceptors/jwt.interceptor.service';

import { ToastrModule } from 'ngx-toastr';
import { authenticationReducer } from './authentication/store/reducer/authentication.reducer';
import { AuthenticationEffects } from './authentication/store/effects/authentication.effects';
import { AuthGuardService } from './guards/auth.guard';
import { SharedModule } from '@/shared/shared.module';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor.service';

@NgModule({
    declarations: [],
    imports: [ 
        CommonModule,
        StoreModule.forFeature('auth', authenticationReducer),
        EffectsModule.forFeature([AuthenticationEffects]),
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN',
            headerName: 'x-xsrf-token'
        }),
    ],
    exports: [
    ],
    providers: [
        AuthGuardService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: URLInterceptorService,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        }
    ],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        // if the module is declared
        if (parentModule) {
            throw new Error(`${parentModule} has already been loaded. Import Core modules in the AppModule only.`);
        }
    }

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: []
        }
    }
    public static forChild(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: []

        }
    }
}