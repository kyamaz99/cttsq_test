import { User, INIT_USER } from "./../../shared/models/index";
import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Repo } from "@user/shared/models";

@Component({
  selector: "repo-content",
  templateUrl: "./repo-content.component.html",
  styleUrls: ["./repo-content.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoContentComponent implements OnChanges {
  @Input() data: Array<Repo>;
  public user: User = INIT_USER;
  ngOnChanges(sc: SimpleChanges) {
    const {
      data: { currentValue }
    } = sc;
    if (currentValue.length > 0) {
      this.user = this.data[0].owner;
    }
  }
  constructor() {}
}
