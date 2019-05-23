import { User } from "./../../shared/models/index";
import { ChangeDetectionStrategy, Input } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() data: Array<User>;

  constructor() {}
}
