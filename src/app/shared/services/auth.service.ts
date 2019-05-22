import { Router } from "@angular/router";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Subscription, of, ReplaySubject, Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { WindowRef } from "./../../win_ref";
import { tap, map } from "rxjs/operators";
import { LocalizeRouterService } from "localize-router";
import { translatedRoute } from "../utils";
interface AuthPayload {
  username: string;
  password: string;
}
interface AuthResponse {
  token: string;
}

const DEV_API = "https://hookia.herokuapp.com/login";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  public sessionToken$: ReplaySubject<string> = new ReplaySubject(1);
  public readonly url: string = this.winRef.getUrl();
  constructor(
    private http: HttpClient,
    private _router: Router,
    private winRef: WindowRef,
    private _localizeService: LocalizeRouterService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  authenticate(login: AuthPayload): Observable<void | Promise<boolean>> {
    //YOUR ENDPOINT HERE
    const { username, password } = login;
    const payload = { login: username, pwd: password };
    return this.http.post(DEV_API, payload).pipe(
      map((log: AuthResponse) => {
        const { token } = log;
        this.winRef.nativeWindow.localStorage.setItem("session_token", token);
        const appRoute = translatedRoute(<string>(
          this._localizeService.translateRoute("/app")
        ));
        console.log(appRoute, "go to");
        this._router.navigate(appRoute);
      })
    );
  }

  checkAuthentication(): Observable<any> {
    //YOUR ENDPOINT HERE
    return of(!!this.winRef.nativeWindow.localStorage.getItem("session_token"));
  }

  clearAuthentication(): Observable<void | Promise<boolean>> {
    const loginRoute = translatedRoute(<string>(
      this._localizeService.translateRoute("/app")
    ));

    return this.http.get(`${this.url}/logout`).pipe(
      map(res => {
        if (res["status"] === 200) {
          if (isPlatformBrowser(this.platformId)) {
            if (
              !!this.winRef.nativeWindow.localStorage.getItem("session_token")
            ) {
              this.winRef.nativeWindow.localStorage.removeItem("session_token");
            }
          }
        }
      }),
      tap(_ => this._router.navigate(loginRoute))
    );
  }
}
