//actions
export class UsersFetchAction {
  static readonly type = "[User] fetch user";
  constructor(public payload: string) {}
}

export class UsersSetAction {
  static readonly type = "[User] set user";
  constructor(public payload: Array<any>) {}
}
