import { UserContainerComponent } from "./container/user-container/user-container.component";
import { Routes } from "@angular/router";

export const USER_ROUTES: Routes = [
  {
    path: "",
    component: UserContainerComponent
  },
  { path: "**", redirectTo: "/404" }
];
