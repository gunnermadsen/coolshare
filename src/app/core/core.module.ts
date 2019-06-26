import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS }from '@angular/common/http';
import { MaterialModule } from './material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { URLInterceptorService } from './interceptors/jwt.interceptor.service';

import { ToastrModule } from 'ngx-toastr';
import { authenticationReducer } from './authentication/store/reducer/authentication.reducer';
import { AuthenticationEffects } from './authentication/store/effects/authentication.effects';

@NgModule({
    declarations: [],
    imports: [ 
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        StoreModule.forFeature('auth', authenticationReducer),
        EffectsModule.forFeature([AuthenticationEffects])
    ],
    exports: [
        ReactiveFormsModule,
        MaterialModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: URLInterceptorService,
            multi: true
        },
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