import { ActionType } from "@models/index";
import { FormControl } from "@angular/forms";
import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { debounceTime, tap } from "rxjs/operators";

@Component({
  selector: "input-debounce",
  templateUrl: "./input-debounce.component.html",
  styleUrls: ["./input-debounce.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDebounceComponent implements OnInit {
  @Output() onInputChange: EventEmitter<ActionType<string>> = new EventEmitter();
  public filterCtrl: FormControl;
  constructor() {}
  ngOnInit() {
    this._initControl();
  }

  private _initControl() {
    this.filterCtrl = new FormControl();
    this.filterCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap((value: string) => this.onInputChange.emit({ type: "FILTER", payload: value }))
      )
      .subscribe();
  }
}
