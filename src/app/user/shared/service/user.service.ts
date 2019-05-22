import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { USER_API } from "src/app/shared/const";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private _httpClient: HttpClient) {}

  getUsers(q: string): Observable<Array<any>> {
    console.log(q);
    return this._httpClient.get(`${USER_API}?q=${q}`) as Observable<Array<any>>;
  }

  getRepo(user: string): Observable<any> {
    return this._httpClient.get(`${USER_API}/${user}/repos`);
  }
}
