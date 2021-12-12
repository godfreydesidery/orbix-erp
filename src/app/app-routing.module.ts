import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './authGuard';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ClassComponent } from './inventory/class/class.component';
import { DepartmentComponent } from './inventory/department/department.component';
import { CategoryComponent } from './inventory/category/category.component';
import { MaterialInquiryComponent } from './inventory/material-inquiry/material-inquiry.component';
import { MaterialMasterComponent } from './inventory/material-master/material-master.component';
import { SubCategoryComponent } from './inventory/sub-category/sub-category.component';
import { ProductInquiryComponent } from './inventory/product-inquiry/product-inquiry.component';
import { ProductMasterComponent } from './inventory/product-master/product-master.component';
import { SubClassComponent } from './inventory/sub-class/sub-class.component';
import { LoginComponent } from './login/login.component';
import { AccessContolComponent } from './user/access-contol/access-contol.component';
import { RoleManagerComponent } from './user/role-manager/role-manager.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { BiometricsComponent } from './user/biometrics/biometrics.component';
import { TillAdministrationComponent } from './till/till-administration/till-administration.component';
import { CompanyProfileComponent } from './company/company-profile/company-profile.component';
import { DescriptionAttributesComponent } from './inventory/description-attributes/description-attributes.component';
import { ProductMassManagerComponent } from './inventory/product-mass-manager/product-mass-manager.component';
import { MaterialMassManagerComponent } from './inventory/material-mass-manager/material-mass-manager.component';
import { WebPosComponent } from './web-pos/web-pos.component';
import { SalesReportsSubMenuComponent } from './reports/sales-reports-sub-menu/sales-reports-sub-menu.component';
import { InventoryReportsSubMenuComponent } from './reports/inventory-reports-sub-menu/inventory-reports-sub-menu.component';
import { ProductionReportsSubMenuComponent } from './reports/production-reports-sub-menu/production-reports-sub-menu.component';

const routes: Routes = [
  {path: 'home', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'role-manager', component: RoleManagerComponent, canActivate: [AuthGuard]},
  {path: 'access-control', component: AccessContolComponent, canActivate: [AuthGuard]},
  {path: 'biometrics', component: BiometricsComponent, canActivate: [AuthGuard]},
  {path: 'till-administration', component: TillAdministrationComponent, canActivate: [AuthGuard]},
  {path: 'company-profile', component: CompanyProfileComponent, canActivate: [AuthGuard]},
  {path: 'product-master', component: ProductMasterComponent, canActivate: [AuthGuard]},
  {path: 'product-inquiry', component: ProductInquiryComponent, canActivate: [AuthGuard]},
  {path: 'department', component: DepartmentComponent, canActivate: [AuthGuard]},
  {path: 'class', component: ClassComponent, canActivate: [AuthGuard]},
  {path: 'sub-class', component: SubClassComponent, canActivate: [AuthGuard]},
  {path: 'material-master', component: MaterialMasterComponent, canActivate: [AuthGuard]},
  {path: 'material-inquiry', component: MaterialInquiryComponent, canActivate: [AuthGuard]},
  {path: 'category', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'sub-category', component: SubCategoryComponent, canActivate: [AuthGuard]},
  {path: 'product-mass-manager', component: ProductMassManagerComponent, canActivate: [AuthGuard]},
  {path: 'material-mass-manager', component: MaterialMassManagerComponent, canActivate: [AuthGuard]},
  {path: 'web-pos', component: WebPosComponent, canActivate: [AuthGuard]},
  {path: 'sales-reports-sub-menu', component: SalesReportsSubMenuComponent, canActivate: [AuthGuard]},
  {path: 'inventory-reports-sub-menu', component: InventoryReportsSubMenuComponent, canActivate: [AuthGuard]},
  {path: 'production-reports-sub-menu', component: ProductionReportsSubMenuComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
