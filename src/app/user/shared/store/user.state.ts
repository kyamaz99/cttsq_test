import { User } from "./../models/index";
import { Action, StateContext, State, Store } from "@ngxs/store";
import { Selector } from "@ngxs/store";
import { ActionType } from "@models/index";
import { UsersFetchAction, UsersSetAction } from "./user.actions";
import { tap } from "rxjs/operators";
import { UserService } from "@user/shared/service/user.service";

interface UserStore {
  data: Array<User>;
}

const INITIAL_STATE: UserStore = {
  data: []
};

@State<UserStore>({
  name: "user",
  defaults: INITIAL_STATE
})
export class UserState {
  constructor(private _userService: UserService, private _store: Store) {
    console.log("storer");
  }
  @Selector()
  static getProductSetupView(state: UserStore): Array<User> {
    return state.data;
  }

  @Action(UsersFetchAction)
  fetchUser(context: StateContext<UserStore>, action: ActionType<string>) {
    const { payload } = action;
    console.log(payload);
    this._userService
      .getUsers(payload)
      //catch error
      .pipe(tap(res => context.dispatch(new UsersSetAction(res))))
      .subscribe();
  }
  @Action(UsersSetAction)
  setUser({ getState, setState }: StateContext<UserStore>, action: ActionType<Array<User>>) {
    const current = getState();
    const { payload } = action;
    setState({
      ...current,
      data: payload
    });
  }
}
