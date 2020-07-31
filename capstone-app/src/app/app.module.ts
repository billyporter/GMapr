import { MaterialModule } from './modules/material/material.module';
import { MockWikiHandlerService } from './modules/history/services/mock-wiki-handler.service';
import { WikiSearchHandler } from './modules/history/services/wiki-search-handler.service';
import { PhotosModule } from './modules/photos/photos.module';
import { MapsModule } from './modules/maps/maps.module';
import { HistoryModule } from './modules/history/history.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PhotoFetcher } from './modules/photos/services/photo-fetcher.service';
import { MockPhotoFetcher } from './modules/photos/services/mock-photo-fetcher.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HistoryModule,
    PhotosModule,
    MapsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  // providers: [
  //   { provide: PhotoFetcher, useExisting: MockPhotoFetcher },
  //   { provide: WikiSearchHandler, useExisting: MockWikiHandlerService}
  // ],
  bootstrap: [AppComponent],
})
export class AppModule {}
