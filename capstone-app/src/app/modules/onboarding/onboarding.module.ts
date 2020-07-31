import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ContentComponent } from './content/content.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [ContentComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MaterialModule,
  ],
  exports: [ContentComponent]
})
export class OnboardingModule { }