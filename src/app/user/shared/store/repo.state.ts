import { of } from "rxjs";
import { Repo } from "./../models/index";
import { Action, StateContext, State, Store } from "@ngxs/store";
import { Selector } from "@ngxs/store";
import { ActionType } from "@models/index";

import { tap, catchError, filter, delay } from "rxjs/operators";
import { UserService } from "@user/shared/services/user.service";
import { HttpErrorResponse } from "@angular/common/http";
import { RepoGetAction, RepoSetAction } from "./repo.actions";

interface RepoStore {
  repos: Array<Repo>;
  error: boolean;
}

const INITIAL_STATE: RepoStore = {
  repos: [],
  error: false
};

@State<RepoStore>({
  name: "repo",
  defaults: INITIAL_STATE
})
export class RepoState {
  constructor(private _userService: UserService, private _store: Store) {}

  @Selector()
  static getRepos(state: RepoStore): Array<Repo> {
    return state.repos;
  }
  @Selector()
  static getReposError(state: RepoStore): boolean {
    return state.error;
  }

  @Action(RepoGetAction)
  getRepo(context: StateContext<RepoStore>, { payload }: ActionType<number>): void {
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
        tap(res => context.dispatch(new RepoSetAction(res)))
      )
      .subscribe();
  }
  @Action(RepoSetAction)
  setRepo({ getState, setState }: StateContext<RepoStore>, { payload }: ActionType<Array<Repo>>): void {
    const current = getState();
    setState({
      ...current,
      repos: payload
    });
  }
}
