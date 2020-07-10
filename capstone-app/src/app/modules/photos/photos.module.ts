import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageContainerComponent } from './components/image-container/image-container.component';
import { PhotosSectionComponent } from './components/photos-section/photos-section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ImageContainerComponent, PhotosSectionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  exports: [ImageContainerComponent, PhotosSectionComponent],
})
export class PhotosModule {}
