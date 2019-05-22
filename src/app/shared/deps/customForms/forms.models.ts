import { FormGroup } from "@angular/forms";
export interface viewModelWithFormGroup {
  data: FormGroup;
}
export interface formArrayAction {
  type: "push" | "remove";
  id: number;
}
export interface FormPayload {
  form: FormGroup;
  idx: number;
  path: Array<string>;
}

export interface NgValidator {
  name: string;
  arg?: any;
}
export interface ValidationsMethods {
  validator?: Array<NgValidator>;
  custom?: Array<NgValidator>;
  async?: Array<NgValidator>;
}
export interface FcValidations {
  validations?: ValidationsMethods;
  path: Array<string>;
}
export interface setFcsValues {
  value: any;
  path: string[];
}
