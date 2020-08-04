import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content/content.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [ContentComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [ContentComponent]
})
export class OnboardingModule { }