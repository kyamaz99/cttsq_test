import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription, of } from "rxjs";
import { AuthService } from "@appServices/auth.service";
import { delay, tap, catchError, switchMap } from "rxjs/operators";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "api/login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  public form: FormGroup;
  public failed: boolean = false;
  public sending: boolean = false;
  constructor(_fb: FormBuilder, private _authService: AuthService) {
    this.form = _fb.group({
      username: [
        "",
        Validators.compose([Validators.required, Validators.minLength(2)])
      ],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(2)])
      ]
    });
  }
  formIsSubmitting(bool: boolean): void {
    if (bool) {
      this.sending = true;
      this.form.disable();
      return;
    }

    this.form.enable();
    this.sending = false;
    this.failed = false;
    return;
  }
  onSubmit(login = this.form.value): Subscription {
    return of(true)
      .pipe(
        tap(isSubmitting => this.formIsSubmitting(isSubmitting)),
        switchMap(_ => this._authService.authenticate(login)),
        catchError((err: HttpErrorResponse) => {
          this.failed = <boolean>true;
          return of(false);
        }),
        delay(1000),
        tap((done: false) => this.formIsSubmitting(done))
      )
      .subscribe();
  }
}
