import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiMediaComponent } from './wiki-media/wiki-media.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ WikiMediaComponent ],
  imports: [ CommonModule, FormsModule, HttpClientModule ],
  exports: [ WikiMediaComponent ]
})
export class HistoryModule { }
