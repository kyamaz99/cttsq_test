import * as _cloneDeep from "lodash/fp/cloneDeep";
export { _cloneDeep };

export function isObject<T extends any>(obj: T): boolean {
  return obj === Object(obj);
}
export function safeGet<T extends Object>(value: Object, ...path: string[]): T {
  return path.reduce((prev: Object, prop: string) => {
    if (prev && prev.hasOwnProperty(prop)) {
      return prev[prop];
    } else {
      return null;
    }
  }, value);
}
