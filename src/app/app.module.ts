import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { MainComponent } from './components/import/main.component';
import { FiledivComponent } from './filediv/filediv.component';

import {NgxElectronModule} from 'ngx-electron';
import {MatButtonModule} from '@angular/material/button';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIconModule} from '@angular/material/icon';

import {MatStepperModule} from '@angular/material/stepper';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    WebviewDirective,
    FiledivComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatCardModule,
    NgxElectronModule,
    MatStepperModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
