import { ActionType } from "@models/index";
import { User } from "./../../shared/models/index";
import { Store, Select } from "@ngxs/store";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UsersFetchAction, UsersDataLoadedAction } from "@user/shared/store/user.actions";
import { UserState } from "@user/shared/store/user.state";
import { Observable } from "rxjs";

@Component({
  selector: "user-container",
  templateUrl: "./user-container.component.html",
  styleUrls: ["./user-container.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent {
  @Select(UserState.getUsers) users$: Observable<Array<User>>;
  @Select(UserState.getUserDataLoaded) dataLoaded$: Observable<boolean>;
  @Select(UserState.getUserQuery) query$: Observable<string>;
  constructor(private _store: Store) {}

  handleInputChange({ type, payload }: ActionType<string | boolean>): void {
    if (type === "FILTER") {
      this._store.dispatch(new UsersFetchAction(payload as string));
      return;
    }
    this._store.dispatch(new UsersDataLoadedAction(payload as boolean));
  }
}
