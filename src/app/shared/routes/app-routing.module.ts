import { DEFAULT_APP_LNG } from "./../../app.component";
import { AppLng } from "./../state/state";
import { LocalizeRouterHttpLoader } from "localize-router-http-loader";
import { HttpClient } from "@angular/common/http";
import { LoginComponent } from "./../../login/login/login.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoutesGuardService } from "./routes.guard.service";
//translation
import { TranslateService } from "@ngx-translate/core";
import { LocalizeRouterModule, LocalizeParser, LocalizeRouterSettings } from "localize-router";
import { Location } from "@angular/common";
const ROUTES: Routes = [
  {
    path: "login",
    component: LoginComponent
  },

  {
    path: "",

    canActivate: [RoutesGuardService],
    loadChildren: "./../../user/user.module#UserModule"
  },

  { path: "", redirectTo: `/`, pathMatch: "full" },
  { path: "**", redirectTo: `/`, pathMatch: "full" }
];
// Required for AoT
//had to export them also
export function localizeRouteLoaderFactory(
  translate: TranslateService,
  location: Location,
  settings: LocalizeRouterSettings,
  http: HttpClient
) {
  return new LocalizeRouterHttpLoader(translate, location, settings, http);
}
@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES),
    LocalizeRouterModule.forRoot(ROUTES, {
      parser: {
        provide: LocalizeParser,
        useFactory: localizeRouteLoaderFactory,
        deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient]
      }
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
