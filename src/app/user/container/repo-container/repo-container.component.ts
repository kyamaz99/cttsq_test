import { UserState } from "@user/shared/store/user.state";
import { Store, Select } from "@ngxs/store";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { withLatestFrom, distinctUntilChanged, map, tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { UsersGetRepoAction } from "@user/shared/store/user.actions";
import { Repo } from "@user/shared/models";

@Component({
  selector: "app-repo-container",
  templateUrl: "./repo-container.component.html",
  styleUrls: ["./repo-container.component.scss"]
})
export class RepoContainerComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _store: Store) {}
  @Select(UserState.getRepos) users$: Observable<Array<Repo>>;

  ngOnInit() {
    //  this._getRepo().subscribe();
  }

  private _getRepo(): Observable<number> {
    return this._route.params.pipe(
      withLatestFrom(this._route.params),
      distinctUntilChanged(),
      map(params => {
        const _id = +params[0]["id"];
        if (!isNaN(_id)) {
          return _id;
        }

        console.log(_id);
        console.error(`${params["id"]} is not a number`);
      }),
      tap((id: number) => this._store.dispatch(new UsersGetRepoAction(id)))
    );
  }
}
