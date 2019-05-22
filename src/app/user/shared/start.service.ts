import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { USER_API } from "src/app/shared/const";

//https://api.github.com/search/users?q={SEARCH_TERM}
//https://api.github.com/users/{USERNAME}/repos
@Injectable({
  providedIn: "root"
})
export class StartService {
  constructor(private _httpClient: HttpClient) {}

  getUsers(q: string): Observable<any> {
    console.log(USER_API);
    return this._httpClient.get(`${USER_API}?q=${q}`);
  }

  getRepo(user: string): Observable<any> {
    return this._httpClient.get(`${USER_API}/${user}/repos`);
  }
}
