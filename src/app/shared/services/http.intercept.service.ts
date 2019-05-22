import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { WindowRef } from "src/app/win_ref";
import { Observable, of } from "rxjs";
import { tap, delay } from "rxjs/operators";

function setHeaderClient(request: HttpRequest<any>, payload = "", content_type: string = ""): HttpRequest<any> {
  request = request.clone({
    setHeaders: {
      Authorization: payload,
      Accept: content_type,
      "Content-Type": content_type,
      "Access-Control-Allow-Origin": "*"
    }
  });
  return request;
}

@Injectable({
  providedIn: "root"
})
export class HttpInterceptService implements HttpInterceptor {
  constructor(
    private _router: Router,
    // private NotifyResponseService :NotifyResponseService,
    private winRef: WindowRef
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //set req headers
    /*     const session: string = !!this.winRef.nativeWindow.localStorage.getItem("session_token")
      ? this.winRef.nativeWindow.localStorage.getItem("session_token")
      : null;

    const headers = new HttpHeaders({
      session_token: `${session}`
    });
    const newReq = request.clone({ headers }); */

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const m = {
              status: 200,
              statusText: "loaded"
            };
            /*          this.NotifyResponseService.notify(m);
            this.removeNotif(1500); */
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            // console.log(err)
            if (err.status === 401) {
              this.winRef.clearLogStorage();
              this._router.navigate(["login"]);
            }
            if (err.status === 404) {
              this._router.navigate(["/404"]);
            }
            /*         this.NotifyResponseService.notify(err.message);
              this.removeNotif(3000); */
          }
        }
      )
    );
  }
  private removeNotif(time: number): any {
    /*     let timer = of({})
      .pipe(delay(time))
      .subscribe(r => this.NotifyResponseService.notify(r));
    return timer; */
  }
}
