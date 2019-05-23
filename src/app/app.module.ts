import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "@routes/app-routing.module";
//login
import { LoginModule } from "./login/login.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
//interceptor
import { HttpInterceptService } from "./shared/services/http.intercept.service";
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
//translation
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocalizeRouterService } from "localize-router";
//ngxs
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { environment } from "src/environments/environment.prod";
import { UserState } from "@user/shared/store/user.state";
import { SharedModule } from "./shared/shared.module";
//component
import { AppComponent } from "./app.component";
import { RepoState } from "@user/shared/store/repo.state";

// AoT requires an exported function for factories
export function TanslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoginModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TanslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxsModule.forRoot([UserState, RepoState], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptService,
      multi: true
    },

    TranslateService,
    LocalizeRouterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
