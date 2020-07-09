import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const material = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
];

@NgModule({
  declarations: [],
  imports: material,
  exports: material
})
export class MaterialModule { }
