//API
import { environment } from "./../../environments/environment";

export const ROOT_API: string = environment.url;

export const USER_API: string = `${ROOT_API}users`;
