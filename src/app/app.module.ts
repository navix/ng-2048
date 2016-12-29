import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FieldModule } from './field/field.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FieldModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
