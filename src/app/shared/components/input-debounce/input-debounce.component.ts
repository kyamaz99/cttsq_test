import { Subject, Observable } from "rxjs";
import { ActionType } from "@models/index";
import { FormControl } from "@angular/forms";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  SimpleChange,
  SimpleChanges
} from "@angular/core";
import { debounceTime, tap, takeUntil } from "rxjs/operators";

@Component({
  selector: "input-debounce",
  templateUrl: "./input-debounce.component.html",
  styleUrls: ["./input-debounce.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDebounceComponent implements OnInit, OnDestroy {
  @Input() loaded: boolean;
  @Input() query: string;

  @Output() onInputChange: EventEmitter<ActionType<string | boolean>> = new EventEmitter();

  public filterCtrl: FormControl;
  public destroy$: Subject<true> = new Subject();
  public spinnerSize: number = 10;
  constructor() {}
  ngOnChanges(sc: SimpleChanges) {
    if (sc.loaded) {
      const {
        loaded: { currentValue }
      } = sc;
      if (!!currentValue) {
        this.spinnerSize = 10;
        this.onInputChange.emit({ type: "RESET_LOADED", payload: false });
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  ngOnInit() {
    //if any previous query, set it back from store
    this._initControl(this.query).subscribe();
  }

  private _initControl(q: string): Observable<string> {
    this.filterCtrl = new FormControl(q);
    return this.filterCtrl.valueChanges.pipe(
      debounceTime(1000),
      tap(f => (this.spinnerSize = 20)),
      tap((value: string) => this.onInputChange.emit({ type: "FILTER", payload: value })),
      takeUntil(this.destroy$)
    );
  }
}
