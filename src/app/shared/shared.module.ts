import { ReactiveFormsModule } from "@angular/forms";
import { CustomFormsModule } from "@forms/customForms.module";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  MatInputModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatCardModule,
  MatDividerModule
} from "@angular/material";

import { NotFoundComponent } from "./components/not-found/not-found.component";
import { InputDebounceComponent } from "./components/input-debounce/input-debounce.component";

@NgModule({
  declarations: [NotFoundComponent, InputDebounceComponent],
  providers: [],
  bootstrap: [],
  imports: [
    CustomFormsModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatListModule,
    MatCardModule,
    MatDividerModule
  ],
  exports: [
    CustomFormsModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    NotFoundComponent,
    InputDebounceComponent
  ]
})
export class SharedModule {}
