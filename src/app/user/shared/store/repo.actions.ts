import { Repo } from "../models";

//actions

export class RepoGetAction {
  static readonly type = "[Repo] get repo";
  constructor(public payload: number) {}
}
export class RepoSetAction {
  static readonly type = "[Repo] set repo";
  constructor(public payload: Array<Repo>) {}
}
