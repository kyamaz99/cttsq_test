import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material";
import {
  TranslateModule,
  TranslateLoader,
  TranslateCompiler,
  TranslateParser
} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule.forChild({
      isolate: true
    })
  ],
  declarations: [LoginComponent],
  providers: []
})
export class LoginModule {}
