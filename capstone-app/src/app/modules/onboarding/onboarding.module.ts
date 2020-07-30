import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { OnboardingComponent } from './onboard/onboarding.component';
import { ContentComponent } from './content/content.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [OnboardingComponent, ContentComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgbModule,
    MaterialModule,
  ],
  exports: [OnboardingComponent, ContentComponent]
})
export class OnboardingModule { }