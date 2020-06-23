import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiMediaComponent } from './wiki-media/wiki-media.component';

@NgModule({
  declarations: [WikiMediaComponent],
  imports: [
    CommonModule
  ],
  exports: [
    WikiMediaComponent
  ],
  entryComponents: [
    WikiMediaComponent
  ]
})
export class HistoryModule { }
