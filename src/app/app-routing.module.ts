import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './authGuard';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AccessContolComponent } from './user/access-contol/access-contol.component';
import { RoleManagerComponent } from './user/role-manager/role-manager.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

const routes: Routes = [
  {path: 'home', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'role-manager', component: RoleManagerComponent, canActivate: [AuthGuard]},
  {path: 'access-control', component: AccessContolComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
