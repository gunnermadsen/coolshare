import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { SharedModule } from '@/shared/shared.module';
import { AccountComponent } from '@/modules/account/pages/account/account.component';
import { AccountRoutingModule } from './account.router.module';
import { SigninComponent } from './components/signin/signin.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AccountEffects } from './store/effects/account.effects';
import { AccountReducer } from './store/reducer/account.reducer';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { AdvancedSettingsComponent } from './components/advanced-settings/advanced-settings.component';
import { PictureComponent } from './components/picture/picture.component';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
    declarations: [
        ProfileComponent,
        AccountComponent,
        SigninComponent,
        PersonalInfoComponent,
        AdvancedSettingsComponent,
        PictureComponent

    ],
    imports: [
        CommonModule,
        SharedModule,
        AccountRoutingModule,
        StoreModule.forFeature('Account', AccountReducer),
        EffectsModule.forFeature([AccountEffects]),

        ImageCropperModule,

    ],
    exports: [],
    providers: [],
})
export class AccountModule {}