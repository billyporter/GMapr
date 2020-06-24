import { PhotosModule } from './modules/photos/photos.module';
import { MapsModule } from './modules/maps/maps.module';
import { HistoryModule } from './modules/history/history.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {GoogleMapsModule} from '@angular/google-maps';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HistoryModule,
    PhotosModule,
    MapsModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
