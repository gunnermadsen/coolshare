import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/home/components/login/login.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './modules/home/components/register/register.component';
import { SharedModule } from './shared/shared.module';
import { UploadModule } from './modules/upload-file/upload.module';
import { UploadDetailsComponent } from './modules/dashboard/components/upload-details/upload-details.component';

import { AccountModule } from './modules/account/account.module';
import { HomeModule } from './modules/home/home.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UploadDetailsComponent,
    // PublicShareComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HomeModule,
    UploadModule,
    AccountModule,

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
