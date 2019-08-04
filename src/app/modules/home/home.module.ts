import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { AuthenticationReducer } from '@/core/authentication/store/reducer/authentication.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationEffects } from '@/core/authentication/store/effects/authentication.effects';

@NgModule({
    declarations: [],
    imports: [ 
        CommonModule, 
        SharedModule,
        StoreModule.forFeature('Auth', AuthenticationReducer),
        EffectsModule.forFeature([AuthenticationEffects]),

    ],
    exports: [],
    providers: [],
})
export class HomeModule {}