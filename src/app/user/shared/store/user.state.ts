import { of } from "rxjs";
import { User, Repo } from "./../models/index";
import { Action, StateContext, State, Store } from "@ngxs/store";
import { Selector } from "@ngxs/store";
import { ActionType } from "@models/index";
import { UsersFetchAction, UsersSetAction, UsersGetRepoAction, UsersSetRepoAction } from "./user.actions";
import { tap, catchError, filter } from "rxjs/operators";
import { UserService } from "@user/shared/services/user.service";
import { HttpErrorResponse } from "@angular/common/http";

interface UserStore {
  users: Array<User>;
  repos: Array<Repo>;
  error: boolean;
}

const INITIAL_STATE: UserStore = {
  users: [],
  repos: [],
  error: false
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
  static getUsers(state: UserStore): Array<User> {
    return state.users;
  }
  @Selector()
  static getRepos(state: UserStore): Array<Repo> {
    return state.repos;
  }
  @Selector()
  static getError(state: UserStore): boolean {
    return state.error;
  }

  @Action(UsersFetchAction)
  fetchUser(context: StateContext<UserStore>, action: ActionType<string>): void {
    const { payload } = action;
    this._userService
      .getUsers(payload)
      .pipe(
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
  setUser({ getState, setState }: StateContext<UserStore>, action: ActionType<Array<User>>): void {
    const current = getState();
    const { payload } = action;
    setState({
      ...current,
      users: payload
    });
  }

  //repos

  @Action(UsersGetRepoAction)
  getRepo(context: StateContext<UserStore>, action: ActionType<number>): void {
    const { payload } = action;
    this._userService
      .getRepo(payload)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const current = context.getState();
          context.setState({
            ...current,
            error: true
          });
          return of(false);
        }),
        filter((res: Array<Repo>) => !!res),
        tap(res => context.dispatch(new UsersSetRepoAction(res)))
      )
      .subscribe();
  }
  @Action(UsersSetRepoAction)
  setRepo({ getState, setState }: StateContext<UserStore>, action: ActionType<Array<Repo>>): void {
    const current = getState();
    const { payload } = action;
    setState({
      ...current,
      repos: payload
    });
  }
}
