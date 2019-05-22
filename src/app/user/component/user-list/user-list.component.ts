import { ChangeDetectionStrategy } from "@angular/core";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.sass"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
