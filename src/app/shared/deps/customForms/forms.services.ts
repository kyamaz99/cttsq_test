import { Injectable } from "@angular/core";
import {
  AbstractControl,
  ValidationErrors,
  Validators,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { isValid as _isValid, format as _format } from "date-fns";
import { isObject, _cloneDeep, safeGet } from "./customForms.utils";
import { Observable, of, Subject } from "rxjs";
import { flatMap } from "rxjs/operators";
import {
  viewModelWithFormGroup,
  formArrayAction,
  ValidationsMethods,
  setFcsValues,
  FormPayload,
  NgValidator,
  FcValidations
} from "./forms.models";
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid);
  }
}

@Injectable()
class NullControl extends AbstractControl {
  readonly value: any = null;
  readonly pristine: boolean = true;
  readonly errors: ValidationErrors | null = null;

  private static instance: NullControl;
  controls: null = null;

  private fn_counter = {};

  setValue(value: any, options?: Object): void {
    this.log("setValue");
    return;
  }
  patchValue(value: any, options?: Object): void {
    this.log("patchValue");
  }
  reset(value?: any, options?: Object): void {
    this.log("Reset");
  }

  get(path: any): AbstractControl {
    this.log("get");
    return this;
  }

  push(control: AbstractControl): void {
    this.log("push");
  }

  private log(funcName: string) {
    if (!this.fn_counter.hasOwnProperty(funcName)) {
      this.fn_counter[funcName] = 0;
    }
    this.fn_counter[funcName] += 1;
    console.error(
      "NullControl",
      funcName,
      "called",
      this.fn_counter[funcName],
      "times"
    );
  }

  static getInstance() {
    if (!NullControl.instance) {
      NullControl.instance = new NullControl(Validators.nullValidator, null);
      // ... any one time initialization goes here ...
    }
    return NullControl.instance;
  }
}

@Injectable()
export class FormsService<T extends Object> {
  public push_is_valid$ = new Subject();
  public readonly url_pattern: RegExp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-?]*)*\/?$/;
  public imgsSrc: Object = {};
  public readonly requiredOnly: ValidationsMethods = {
    validator: [{ name: "required" }]
  };

  //Form builder
  build_form(data: T): FormGroup {
    if (Array.isArray(data)) {
      return new FormGroup({ data: this._rec_build_form(data) });
    } else if (isObject(data)) {
      return <FormGroup>this._rec_build_form(data);
    } else {
      return new FormGroup({ data: this._rec_build_form(data) });
    }
  }
  _rec_build_form(data) {
    if (
      data instanceof FormArray ||
      data instanceof FormGroup ||
      data instanceof FormControl
    ) {
      return data;
    }
    if (Array.isArray(data)) {
      let array_out = [];
      for (let sub of data) {
        let output = this._rec_build_form(sub);
        array_out.push(output);
      }
      return new FormArray(array_out);
    } else if (isObject(data)) {
      let copy = _cloneDeep(data);
      for (let pro in copy) {
        copy[pro] = this._rec_build_form(copy[pro]);
      }
      return new FormGroup(copy);
    } else {
      return new FormControl(data);
    }
  }
  // form methods
  getSubFormByList<T extends AbstractControl>(
    form: AbstractControl,
    path: string[]
  ): T | NullControl {
    let t: AbstractControl;
    t = form;
    let accu: Array<string> = [];
    path.map(p => {
      let old_t = t;
      t = t.get(p);
      if (!t) {
        if (accu.length != 0) {
          console.error(p, "not found after", accu.join("->"));
        } else {
          console.error(p, "not found at root");
        }
        console.error("possible choices are:");
        if (old_t instanceof FormControl) {
          console.error("\t", old_t.value);
        } else if (old_t instanceof FormGroup) {
          for (let key in old_t.value) {
            console.error("\t", key);
          }
        } else if (old_t instanceof FormArray) {
          console.error("any integer between 0 and ", old_t.value.length - 1);
        } else {
          console.error("\t no choice");
        }
        t = NullControl.getInstance();
      }
      accu.push(p);
    });
    return <T>t;
  }

  getSubForm<T extends AbstractControl>(
    form: AbstractControl,
    ...path: string[]
  ): T | NullControl {
    return this.getSubFormByList(form, path);
  }

  getSubFormValue(form: AbstractControl, ...path: string[]): any {
    let subform = this.getSubFormByList(form, path);
    return subform.value;
  }

  isSubFormPristine(form: AbstractControl, ...path: string[]): any {
    let subform = this.getSubFormByList(form, path);
    return subform.pristine;
  }

  getSubFormControls<T extends FormGroup | FormArray | FormControl>(
    form: AbstractControl,
    ...path: string[]
  ): ({ [key: string]: AbstractControl }) | AbstractControl[] | null {
    let subform = this.getSubFormByList(form, path);
    if (
      subform instanceof FormGroup ||
      subform instanceof FormArray ||
      subform instanceof NullControl
    ) {
      return subform["controls"];
    }
  }

  getSubFormArrayControls<T extends FormArray>(
    form: AbstractControl,
    ...path: string[]
  ): AbstractControl[] {
    let subform = this.getSubForm<FormArray>(form, ...path);
    if (subform instanceof FormArray) {
      return subform["controls"];
    } else {
      console.error("subform not a FormArray:", typeof subform, subform);
      return [];
    }
  }

  setSubFormValue(form: AbstractControl, value: any, ...path: string[]) {
    let subform: AbstractControl = this.getSubFormByList(form, path);
    subform.setValue(value);
  }

  setSubFormControl(form: AbstractControl, value: any, ...path: string[]) {
    let last_point = path.pop();
    let subform: AbstractControl = this.getSubFormByList(form, path);
    if (subform instanceof FormGroup) {
      subform.setControl(last_point, this._rec_build_form(value));
    } else if (subform instanceof FormArray) {
      let index = parseInt(last_point);
      if (index == NaN) {
        console.error("FormArray ask for index");
      } else {
        subform.setControl(index, this._rec_build_form(value));
      }
    } else {
      console.error("setControl not supported for this");
    }
  }
  deleteSubForm(form: AbstractControl, ...path: string[]) {
    const ctrl_name = path.pop();
    const fg_path = path.splice(-1, 1);
    let subform: AbstractControl = this.getSubFormByList(form, fg_path);
    if (subform instanceof FormGroup) {
      subform.removeControl(ctrl_name);
    }

    console.error("deleteSubForm not supported for this");
  }
  pushSubFormArray(form: AbstractControl, value: any, ...path: string[]) {
    let subform: FormArray | NullControl = this.getSubFormByList(form, path);
    if (!subform) {
      subform = NullControl.getInstance();
      console.error(path.join("->"), " is not a FormArray");
    }
    subform.push(this._rec_build_form(value));
  }

  deleteSubFormArray(form: AbstractControl, value: number, ...path: string[]) {
    let subform: FormArray | NullControl = this.getSubFormByList(form, path);
    if (!subform) {
      subform = NullControl.getInstance();
      console.error(path.join("->"), " is not a FormArray");
    }
    if (subform instanceof FormArray) {
      subform.removeAt(value);
    }
  }

  getSubFormArrays<T extends FormGroup | FormArray>(
    form: AbstractControl,
    ...path: string[]
  ): FormArray {
    let subform: FormArray | NullControl = this.getSubFormByList(form, path);
    if (subform instanceof FormArray) {
      return subform;
    }
  }

  setCtrlValue = (
    form: AbstractControl,
    value: any,
    ...path: string[]
  ): any => {
    let new_form = _cloneDeep(form);
    this.setSubFormValue(new_form, value, ...path);
    return new_form;
  };
  /**
   * set multiple form control values at once
   *
   * @param {FormGroup} fg
   * @param {Array<setFcsValues>} data
   * @returns {FormGroup}
   * @memberof FormsService
   */
  setCtrlsValues(fg: FormGroup, data: Array<setFcsValues>): FormGroup {
    data.map(d => {
      this.setSubFormValue(fg, d.value, ...d.path);
    });
    return fg;
  }
  /**
   * delete nested arrays in form
   * if the element has an id, make a delete request
   * then delete it from local reference
   * All operations are made on the same reference to avoid ungly glitch
   * @param {Injectable} service
   * @param {Function} func
   * @param {FormGroup} form
   * @param {number} idx
   * @param {any} path
   * @returns {Observable<FormGroup>}
   * @memberof FormsService
   */

  //deleteSubArray(service: Injectable, func: Function, {form: FormGroup, idx: number, ...path): Observable<FormGroup> {
  deleteSubArray(
    service: Injectable,
    func: Function,
    { form, idx, path }: FormPayload
  ): Observable<FormGroup> {
    const targetId = [...path, ...[idx.toString(), "id"]];
    const newF = _cloneDeep(form);
    const id = this.getSubFormValue(form, ...targetId);
    if (!!id) {
      return func
        .call(service, id)
        .pipe(flatMap(f => this._deleteLocalForm({ form: newF, idx, path })));
    } else {
      return this._deleteLocalForm({ form: newF, idx, path });
    }
  }

  private _deleteLocalForm({ form, idx, path }): Observable<FormGroup> {
    this.getSubFormArrays(form, path).removeAt(idx);
    return of(form);
  }
  //validations
  /**
   * Sets form control validations
   * It's a setter, any existing validation will be reset
   *
   * @param {FormGroup} form
   * @param {ValidationsMethods} meth validator take as value array of validator method name, custome take as value array of custom functions
   * @param {string[]} path
   * @returns {FormGroup}
   * @memberof FormsService
   */
  setCtrlValidations(
    form: FormGroup,
    meth: ValidationsMethods,
    ...path: string[]
  ): FormGroup {
    this.getSubForm(form, ...path).setValidators(
      this._setValFcns(
        this._setValMeth(meth.validator),
        this._setValMeth(meth.custom)
      )
    );
    this.getSubForm(form, ...path).updateValueAndValidity({
      onlySelf: true,
      emitEvent: false
    });
    return form;
  }

  private _setValMeth(prop: undefined | Array<any>): any {
    return prop ? prop : [];
  }
  private _setValFcns(
    valProp: Array<NgValidator>,
    fns: Array<NgValidator>
  ): ValidatorFn | ValidatorFn[] {
    //    TODO pass arg to bind
    //  Validators[fcn["name"]].bind(this, [fcn["arg"]])
    const validators = valProp.map(fcn => Validators[fcn["name"]].bind(this));
    const custom = fns.map(fcn => this[fcn.name].apply(this, fcn.arg));
    let all = [...validators, ...custom];
    return all;
  }

  /**
   * Perfom setCtrlValidations on a list of item
   * @param {FormGroup} f
   * @param {Array<FcValidations>} arr
   * @returns {FormGroup}
   * @memberof FormsService
   */
  setCtrlsValidation(f: FormGroup, arr: Array<FcValidations>): FormGroup {
    let new_f = _cloneDeep(f);
    arr.map(a => {
      new_f = this.setCtrlValidations(f, a["validations"], ...a["path"]);
    });
    return new_f;
  }
  /**
   * Add required validation on inputs
   * optional: can also append custom function validation
   * @param {FormGroup} f
   * @param {Array<FcValidations>} arr
   * @returns {FormGroup}
   * @memberof FormsService
   */
  setCtrlsAreRequired(f: FormGroup, arr: Array<FcValidations>): FormGroup {
    let new_f = _cloneDeep(f);
    arr.map(a => {
      if (a["validations"]) {
        let newval = { ...this.requiredOnly, ...a.validations };
        new_f = this.setCtrlValidations(f, newval, ...a.path);
      } else {
        new_f = this.setCtrlValidations(f, this.requiredOnly, ...a.path);
      }
    });
    return new_f;
  }
  clearValidations(f: FormGroup, arr: Array<FcValidations>): void {
    arr.map(a => {
      this.getSubForm(f, ...a.path).clearValidators();
    });
  }
  //custom validation fns
  validatorIsUrl() {
    return (control: FormControl) => {
      if (!!!control.value) {
        return null;
      }
      if (!this.url_pattern.test(control.value)) {
        return {
          notUrl: {
            msg: "PLEASE_CHECK_YOUR_URL"
          }
        };
      }

      return null;
    };
  }

  ValidatorInvalidInteger() {
    return (control: FormControl) => {
      if (Math.sign(control.value) === -1) {
        return {
          invalid_number: {
            msg: "INVALID_NUMBER"
          }
        };
      }
      return null;
    };
  }
  ValidatorMaxNumber(max: number) {
    return (control: FormControl) => {
      if (!control.value || control.value > max) {
        return {
          invalid_max_value: {
            msg: "INVALID_MAX_NUMBER"
          }
        };
      }
      return null;
    };
  }
  ValidatorMinNumber(min: number) {
    return (control: FormControl) => {
      if (
        control.value === null ||
        control.value === undefined ||
        control.value < min
      ) {
        return {
          invalid_min_value: {
            msg: "INVALID_MIN_NUMBER"
          }
        };
      }
      return null;
    };
  }
  validatorTxtMaxLen(max: number) {
    return (control: FormControl) => {
      if (!control.value || control.value.length > max) {
        return {
          invalidLength: {
            msg: "TEXT_LENGTH_INVALID"
          }
        };
      }
      return null;
    };
  }
  private isDate(d: any): any {
    if (!_isValid(d)) {
      return {
        dateInvalid: {
          msg: "DATE_INVALID"
        }
      };
    }
  }

  ///State related helpers
  public mapViewDataToFormGroup(
    arr: Array<Object>,
    ...path
  ): Array<viewModelWithFormGroup> {
    return arr.map(d => ({
      ...d,
      data: this.build_form(safeGet(d, ...path))
    }));
  }
}

export function updateFormArray(
  form: FormArray,
  action: formArrayAction
): FormArray {
  const { type, id } = action;
  if (type === "push") {
    form.push(new FormControl(id));
    return;
  }
  const idPostion = form.value.findIndex(f => f === id);
  form.removeAt(idPostion);
  return form;
}

export function formatDatePickerDate(date, format = _format) {
  return format(date, "DD/MM/YY");
}
/**
 * subscribe to form reset event
 *
 * @export
 * @param {CommonService} service
 * @param {FormGroup} form
 * @returns {Observable<boolean>}
 */
/* export function subFormError(
  service: CommonService,
  form: FormGroup
): Observable<boolean> {
  return service.resetForm$.pipe(
    filter(val => val),
    tap(_ => form.reset())
  );
}
 */
