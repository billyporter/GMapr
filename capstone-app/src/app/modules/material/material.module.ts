import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

const material = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
];

@NgModule({
  declarations: [],
  imports: material,
  exports: material
})
export class MaterialModule { }
