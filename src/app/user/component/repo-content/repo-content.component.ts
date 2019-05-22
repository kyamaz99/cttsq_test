import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { Repo } from "@user/shared/models";

@Component({
  selector: "repo-content",
  templateUrl: "./repo-content.component.html",
  styleUrls: ["./repo-content.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoContentComponent implements OnInit {
  @Input() data: Array<Repo>;

  constructor() {}

  ngOnInit() {}
}
