import { PhotosModule } from './modules/photos/photos.module';
import { MapsModule } from './modules/maps/maps.module';
import { HistoryModule } from './modules/history/history.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PhotoFetcher } from './modules/photos/services/photo-fetcher.service';
import { MockPhotoFetcher } from './modules/photos/services/mock-photo-fetcher.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HistoryModule,
    PhotosModule,
    MapsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: PhotoFetcher, useExisting: MockPhotoFetcher }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
