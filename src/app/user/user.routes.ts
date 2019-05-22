import { UserContainerComponent } from "./container/user-container/user-container.component";
import { Routes } from "@angular/router";
import { RepoContainerComponent } from "./container/repo-container/repo-container.component";

export const USER_ROUTES: Routes = [
  {
    path: "",
    component: UserContainerComponent
  },
  {
    path: ":id/repos",
    component: RepoContainerComponent
  },

  { path: "**", redirectTo: "/404" }
];
