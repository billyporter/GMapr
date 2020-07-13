import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiMediaComponent } from './wiki-media/wiki-media.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from './../material/material.module';

@NgModule({
  declarations: [ WikiMediaComponent ],
  imports: [ CommonModule, FormsModule, HttpClientModule, MatCardModule, MatCardModule ],
  exports: [ WikiMediaComponent ]
})
export class HistoryModule { }
