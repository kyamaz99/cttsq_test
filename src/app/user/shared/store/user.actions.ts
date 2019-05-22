import { User, Repo } from "../models";

//actions
export class UsersFetchAction {
  static readonly type = "[User] fetch user";
  constructor(public payload: string) {}
}

export class UsersSetAction {
  static readonly type = "[User] set user";
  constructor(public payload: Array<User>) {}
}

export class UsersGetRepoAction {
  static readonly type = "[User] get repo";
  constructor(public payload: number) {}
}
export class UsersSetRepoAction {
  static readonly type = "[User] set repo";
  constructor(public payload: Array<Repo>) {}
}
