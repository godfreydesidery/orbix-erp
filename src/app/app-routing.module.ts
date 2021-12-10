import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './authGuard';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ClassComponent } from './inventory/class/class.component';
import { DepartmentComponent } from './inventory/department/department.component';
import { MaterialCategoryComponent } from './inventory/material-category/material-category.component';
import { MaterialMasterComponent } from './inventory/material-master/material-master.component';
import { MaterialSubCategoryComponent } from './inventory/material-sub-category/material-sub-category.component';
import { ProductInquiryComponent } from './inventory/product-inquiry/product-inquiry.component';
import { ProductMasterComponent } from './inventory/product-master/product-master.component';
import { SubClassComponent } from './inventory/sub-class/sub-class.component';
import { LoginComponent } from './login/login.component';
import { AccessContolComponent } from './user/access-contol/access-contol.component';
import { RoleManagerComponent } from './user/role-manager/role-manager.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

const routes: Routes = [
  {path: 'home', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'role-manager', component: RoleManagerComponent, canActivate: [AuthGuard]},
  {path: 'access-control', component: AccessContolComponent, canActivate: [AuthGuard]},
  {path: 'product-master', component: ProductMasterComponent, canActivate: [AuthGuard]},
  {path: 'product-inquiry', component: ProductInquiryComponent, canActivate: [AuthGuard]},
  {path: 'department', component: DepartmentComponent, canActivate: [AuthGuard]},
  {path: 'class', component: ClassComponent, canActivate: [AuthGuard]},
  {path: 'sub-class', component: SubClassComponent, canActivate: [AuthGuard]},
  {path: 'material-master', component: MaterialMasterComponent, canActivate: [AuthGuard]},
  {path: 'material-category', component: MaterialCategoryComponent, canActivate: [AuthGuard]},
  {path: 'material-sub-category', component: MaterialSubCategoryComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
