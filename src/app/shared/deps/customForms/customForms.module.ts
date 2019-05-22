import { NgModule } from "@angular/core";
import { FormsService } from "./forms.services";
import { FormError } from "./forms.error";
import { ErrorStateMatcher } from "@angular/material";

@NgModule({
  declarations: [],
  providers: [FormsService, { provide: ErrorStateMatcher, useClass: FormError }]
})
export class CustomFormsModule {}
