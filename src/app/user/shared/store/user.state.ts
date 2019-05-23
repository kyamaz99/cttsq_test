import { of } from "rxjs";
import { User, Repo } from "./../models/index";
import { Action, StateContext, State, Store } from "@ngxs/store";
import { Selector } from "@ngxs/store";
import { ActionType } from "@models/index";
import { UsersFetchAction, UsersSetAction, UsersDataLoadedAction } from "./user.actions";
import { tap, catchError, filter, delay } from "rxjs/operators";
import { UserService } from "@user/shared/services/user.service";
import { HttpErrorResponse } from "@angular/common/http";

interface UserStore {
  users: Array<User>;
  error: boolean;
  data_loaded: boolean;
  query: string;
}

const INITIAL_STATE: UserStore = {
  users: [],
  error: false,
  data_loaded: false,
  query: null
};

@State<UserStore>({
  name: "user",
  defaults: INITIAL_STATE
})
export class UserState {
  constructor(private _userService: UserService, private _store: Store) {}
  @Selector()
  static getUsers(state: UserStore): Array<User> {
    return state.users;
  }
  @Selector()
  static getUserQuery(state: UserStore): string {
    return state.query;
  }

  @Selector()
  static getUserError(state: UserStore): boolean {
    return state.error;
  }
  @Selector()
  static getUserDataLoaded(state: UserStore): boolean {
    return state.data_loaded;
  }

  @Action(UsersFetchAction)
  fetchUser(context: StateContext<UserStore>, { payload }: ActionType<string>): void {
    const current = context.getState();
    context.setState({
      ...current,
      query: payload
    });

    this._userService
      .getUsers(payload)
      .pipe(
        tap(res => context.dispatch(new UsersDataLoadedAction(true))),
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          const current = context.getState();
          context.setState({
            ...current,
            error: true
          });
          return of(false);
        }),
        filter((res: Array<User>) => !!res),
        tap(res => context.dispatch(new UsersSetAction(res)))
      )
      .subscribe();
  }
  @Action(UsersSetAction)
  setUser({ getState, setState }: StateContext<UserStore>, { payload }: ActionType<Array<User>>): void {
    const current = getState();
    setState({
      ...current,
      users: payload
    });
  }

  @Action(UsersDataLoadedAction)
  dataLoaded({ getState, setState }: StateContext<UserStore>, { payload }: ActionType<boolean>): void {
    const current = getState();
    setState({
      ...current,
      data_loaded: payload
    });
  }
}
