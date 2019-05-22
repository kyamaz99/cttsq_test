export interface ActionType<T> {
  type: string;
  payload: T;
}

export type Partial<T> = { [P in keyof T]?: T[P] };
