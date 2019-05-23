import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { USER_API } from "src/app/shared/const";
import { Repo, User } from "../models";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private _httpClient: HttpClient) {}

  getUsers(q: string): Observable<Array<User>> {
    return this._httpClient.get(`${USER_API}?q=${q}`) as Observable<Array<User>>;
  }

  getRepo(user: number): Observable<Array<Repo>> {
    return this._httpClient.get(`${USER_API}/${user}/repos`) as Observable<Array<Repo>>;
  }
}
