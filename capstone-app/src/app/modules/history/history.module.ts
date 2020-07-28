import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiMediaComponent } from './wiki-media/wiki-media.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [ WikiMediaComponent],
  exports: [ WikiMediaComponent ],
  imports: [ CommonModule, FormsModule, HttpClientModule, BrowserModule, ReactiveFormsModule, MaterialModule ],
})
export class HistoryModule { }
