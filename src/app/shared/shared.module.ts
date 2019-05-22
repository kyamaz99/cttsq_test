import { CustomFormsModule } from "@forms/customForms.module";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [],
  providers: [],
  bootstrap: [],
  imports: [CustomFormsModule, TranslateModule],
  exports: [CustomFormsModule, TranslateModule]
})
export class SharedModule {}
