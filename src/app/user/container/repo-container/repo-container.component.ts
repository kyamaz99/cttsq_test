import { UserState } from "@user/shared/store/user.state";
import { Store, Select } from "@ngxs/store";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { withLatestFrom, distinctUntilChanged, map, tap, takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { Repo } from "@user/shared/models";
import { RepoGetAction } from "@user/shared/store/repo.actions";
import { RepoState } from "@user/shared/store/repo.state";

@Component({
  selector: "app-repo-container",
  templateUrl: "./repo-container.component.html",
  styleUrls: ["./repo-container.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoContainerComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _store: Store) {}
  @Select(RepoState.getRepos) users$: Observable<Array<Repo>>;
  public destroy$: Subject<true> = new Subject();

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  ngOnInit() {
    this._getRepo().subscribe();
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
        console.error(`${params["id"]} is not a number`);
      }),
      tap((id: number) => this._store.dispatch(new RepoGetAction(id))),
      takeUntil(this.destroy$)
    );
  }
}
