import { AuthService } from "@appServices/auth.service";
import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import {
  CanDeactivate,
  CanActivate,
  Router,
  ActivatedRoute
} from "@angular/router";
import { WindowRef } from "src/app/win_ref";
import { Observable, of, ReplaySubject } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { tap, filter, map, switchMap, first } from "rxjs/operators";
import { LocalizeRouterService } from "localize-router";
import { translatedRoute } from "../utils";

@Injectable({
  providedIn: "root"
})
export class RoutesGuardService implements CanActivate {
  private authorized = {
    session_token: null
  };
  private has_auth$: ReplaySubject<boolean> = new ReplaySubject(1);
  private has_logged: boolean = false;

  constructor(
    private _router: Router,
    private winRef: WindowRef,
    private _authService: AuthService,
    private _localizeService: LocalizeRouterService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): Observable<boolean> {
    const loginRoute = translatedRoute(<string>(
      this._localizeService.translateRoute("/login")
    ));

    //angular universal
    if (isPlatformBrowser(this.platformId)) {
      if (window !== undefined) {
        this.has_logged = !!this.winRef.nativeWindow.localStorage.getItem(
          "session_token"
        );
        if (this.has_logged) {
          return this._authService.checkAuthentication().pipe(
            map(response => {
              if (response) {
                return true;
              }
              console.log(loginRoute, "UUUUUUU");

              this._router.navigate(loginRoute);
              return false;
            })
          );
        }
      }
      this._router.navigate(loginRoute);
      return of(false);
    }
  }
}
export class LeaveAppGuard implements CanDeactivate<any> {
  constructor() {}
  canDeactivate(component: any) {
    return component.logOut();
  }
}
