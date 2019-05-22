import { UserState } from "@user/shared/store/user.state";
import { LocalizeRouterModule } from "localize-router";
import { RouterModule } from "@angular/router";
import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserContainerComponent } from "./container/user-container/user-container.component";
import { UserListComponent } from "./component/user-list/user-list.component";
import { USER_ROUTES } from "./user.routes";
import { NgxsModule } from "@ngxs/store";
import { RepoContainerComponent } from './container/repo-container/repo-container.component';
import { RepoContentComponent } from './component/repo-content/repo-content.component';

@NgModule({
  declarations: [UserContainerComponent, UserListComponent, RepoContainerComponent, RepoContentComponent],

  imports: [CommonModule, SharedModule, RouterModule.forChild(USER_ROUTES), LocalizeRouterModule.forChild(USER_ROUTES)]
})
export class UserModule {}
