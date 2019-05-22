import { FormsService } from "@forms/forms.services";
import { Store } from "@ngxs/store";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UsersFetchAction } from "@user/shared/store/user.actions";

@Component({
  selector: "user-container",
  templateUrl: "./user-container.component.html",
  styleUrls: ["./user-container.component.sass"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent implements OnInit {
  constructor(private _store: Store, public formsService: FormsService<{ name: string }>) {}

  ngOnInit() {
    console.log("init");
    this._store.dispatch(new UsersFetchAction("todd"));
  }
}
