import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const material = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatIconModule
];

@NgModule({
  declarations: [],
  imports: material,
  exports: material
})
export class MaterialModule { }
