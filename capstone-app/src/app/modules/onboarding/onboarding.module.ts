import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content/content.component';
import { MaterialModule } from '../material/material.module';
import { OnboardComponent } from './onboard/onboard.component';

@NgModule({
  declarations: [ContentComponent, OnboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [ContentComponent]
})
export class OnboardingModule { }