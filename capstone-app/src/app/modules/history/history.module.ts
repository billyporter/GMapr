import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiMediaComponent } from './wiki-media/wiki-media.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from './../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserModule} from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ WikiMediaComponent],
  exports: [ WikiMediaComponent ],
  imports: [ CommonModule, FormsModule, HttpClientModule, MatCardModule, BrowserModule,
             MatNativeDateModule, ReactiveFormsModule, MatMenuModule, MatIconModule ],
})
export class HistoryModule { }
