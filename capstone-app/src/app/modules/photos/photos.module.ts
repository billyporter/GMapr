import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageContainerComponent } from './components/image-container/image-container.component';
import { PhotosSectionComponent } from './components/photos-section/photos-section.component';

@NgModule({
  declarations: [ImageContainerComponent, PhotosSectionComponent],
  imports: [CommonModule],
  exports: [ImageContainerComponent, PhotosSectionComponent],
})
export class PhotosModule {}
