import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-photos-section',
  templateUrl: './photos-section.component.html',
  styleUrls: ['./photos-section.component.scss']
})
export class PhotosSectionComponent {
  limitControl = new FormControl(10, [Validators.min(1), Validators.max(10)]);
  maxPhotos = 10;

  updateLimit(newLimit: number) {
    this.maxPhotos = newLimit;
    this.limitControl = new FormControl(newLimit);
  }
}
