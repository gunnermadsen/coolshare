import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/home/components/login/login.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { reducers, metaReducers } from './reducers';
import { StoreModule } from '@ngrx/store';
import { environment } from '@/../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { RegisterComponent } from './modules/home/components/register/register.component';
import { SharedModule } from './shared/shared.module';
import { UploadModule } from './modules/upload-file/upload.module';
import { UploadDetailsComponent } from './modules/dashboard/components/upload-details/upload-details.component';
import { FileSizePipe } from './shared/pipes/file-size.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UploadDetailsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    UploadModule,

    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),

    CoreModule
  ],
  exports: [
  ],
  entryComponents: [
    UploadDetailsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
