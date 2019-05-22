import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";

@Injectable({ providedIn: "root" })
export class WindowRef {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  get nativeWindow(): any {
    return _window();
  }

  clearLogStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (window != undefined) {
        if (!!_window().localStorage.getItem("session_token")) {
          _window().localStorage.removeItem("session_token");
        }
      }
    }
  }
  getUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      if (window != undefined) {
        return (
          _window().location.protocol +
          "//" +
          _window().location.hostname +
          ":" +
          _window().location.port
        );
      }
    }
  }
}
function _window(): any {
  // return the native window obj
  return window;
}
