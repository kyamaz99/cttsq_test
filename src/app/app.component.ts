import { AppLng } from "./shared/state/state";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import { WindowRef } from "./win_ref";
import { fadeInAnimation } from "./shared/animations/animations";
import { TranslateService } from "@ngx-translate/core";
import { tap } from "rxjs/operators";
import { LocalizeRouterService } from "localize-router";

export const DEFAULT_APP_LNG: "ge" | "en" = "ge";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [fadeInAnimation],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  public server$ = new Subject();
  constructor(
    private _router: Router,
    private winRef: WindowRef,
    //  private _notifyResponseService: NotifyResponseService,
    private route: ActivatedRoute,
    private _translate: TranslateService,
    private _localizeRouter: LocalizeRouterService
  ) {
    _translate.setDefaultLang(DEFAULT_APP_LNG);
    AppLng.set(DEFAULT_APP_LNG);
  }

  useLanguage(language: string) {
    AppLng.set(language);
    this._translate.use(language);
  }

  ngOnDestroy() {
    this._localizeRouter.routerEvents.unsubscribe();
  }

  ngOnInit() {
    //  this.subServerResp();
    this._localizeRouter.routerEvents
      .pipe(tap(lg => this.useLanguage(lg)))
      .subscribe();
  }
  subServerResp(): any {
    /*    return this._notifyResponseService.server_response$.subscribe(r =>
      this.server$.next(r)
    ); */
  }
  dismiss_notif(): void {
    // return this.server$.next({});
  }
  getRouteAnimation(outlet): any {
    return outlet.activatedRouteData.animation;
  }
}
