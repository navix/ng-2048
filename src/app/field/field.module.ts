import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from './field/field.component';

const COMPONENTS = [
  FieldComponent,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: COMPONENTS,
  declarations: COMPONENTS,
  providers: []
})
export class FieldModule {
}