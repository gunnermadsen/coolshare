import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

import { SharedModule } from './shared/shared.module';
import { UploadModule } from './modules/upload-file/upload.module';
import { UploadDetailsComponent } from './modules/dashboard/components/upload-details/upload-details.component';

import { AccountModule } from './modules/account/account.module';
import { HomeModule } from './modules/home/home.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    UploadDetailsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    HomeModule,
    SharedModule,
    UploadModule,
    AccountModule,
    NotificationsModule
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
