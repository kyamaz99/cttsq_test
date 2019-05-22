import { ActionType } from "@models/index";
import { User } from "./../../shared/models/index";
import { FormsService } from "@forms/forms.services";
import { Store, Select } from "@ngxs/store";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UsersFetchAction } from "@user/shared/store/user.actions";
import { UserState } from "@user/shared/store/user.state";
import { Observable } from "rxjs";

@Component({
  selector: "user-container",
  templateUrl: "./user-container.component.html",
  styleUrls: ["./user-container.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent implements OnInit {
  @Select(UserState.getUsers) users$: Observable<Array<User>>;

  constructor(private _store: Store, public formsService: FormsService<{ name: string }>) {}

  ngOnInit() {}

  handleInputChange({ payload }: ActionType<string>) {
    // this._store.dispatch(new UsersFetchAction(payload ));
  }
}
