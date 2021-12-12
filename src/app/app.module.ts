import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { JwtInterceptor, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpErrorInterceptor } from 'src/error-interceptor';
import { MatAutocompleteModule} from '@angular/material/autocomplete'

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AdminMenuComponent } from './menu/admin-menu/admin-menu.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { RoleManagerComponent } from './user/role-manager/role-manager.component';
import { RouterModule } from '@angular/router';
import { AccessContolComponent } from './user/access-contol/access-contol.component';
import { InventoryMenuComponent } from './menu/inventory-menu/inventory-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductMasterComponent } from './inventory/product-master/product-master.component';
import { ProductInquiryComponent } from './inventory/product-inquiry/product-inquiry.component';
import { DepartmentComponent } from './inventory/department/department.component';
import { ClassComponent } from './inventory/class/class.component';
import { SubClassComponent } from './inventory/sub-class/sub-class.component';
import { MaterialMasterComponent } from './inventory/material-master/material-master.component';
import { CategoryComponent } from './inventory/category/category.component';
import { SubCategoryComponent } from './inventory/sub-category/sub-category.component';
import { MechandizerMenuComponent } from './menu/mechandizer-menu/mechandizer-menu.component';
import { SupplierRelationsMenuComponent } from './menu/supplier-relations-menu/supplier-relations-menu.component';
import { CustomerRelationsMenuComponent } from './menu/customer-relations-menu/customer-relations-menu.component';
import { HumanResourceMenuComponent } from './menu/human-resource-menu/human-resource-menu.component';
import { MaterialInquiryComponent } from './inventory/material-inquiry/material-inquiry.component';
import { BiometricsComponent } from './user/biometrics/biometrics.component';
import { TillAdministrationComponent } from './till/till-administration/till-administration.component';
import { CompanyProfileComponent } from './company/company-profile/company-profile.component';
import { DescriptionAttributesComponent } from './inventory/description-attributes/description-attributes.component';
import { ProductMassManagerComponent } from './inventory/product-mass-manager/product-mass-manager.component';
import { MaterialMassManagerComponent } from './inventory/material-mass-manager/material-mass-manager.component';
import { WebPosComponent } from './web-pos/web-pos.component';
import { ReportMenuComponent } from './menu/report-menu/report-menu.component';
import { SalesReportsSubMenuComponent } from './reports/sales-reports-sub-menu/sales-reports-sub-menu.component';
import { InventoryReportsSubMenuComponent } from './reports/inventory-reports-sub-menu/inventory-reports-sub-menu.component';
import { ProductionReportsSubMenuComponent } from './reports/production-reports-sub-menu/production-reports-sub-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    AdminMenuComponent,
    SideBarComponent,
    UserProfileComponent,
    RoleManagerComponent,
    AccessContolComponent,
    InventoryMenuComponent,
    ProductMasterComponent,
    ProductInquiryComponent,
    DepartmentComponent,
    ClassComponent,
    SubClassComponent,
    MaterialMasterComponent,
    CategoryComponent,
    SubCategoryComponent,
    MechandizerMenuComponent,
    SupplierRelationsMenuComponent,
    CustomerRelationsMenuComponent,
    HumanResourceMenuComponent,
    MaterialInquiryComponent,
    BiometricsComponent,
    TillAdministrationComponent,
    CompanyProfileComponent,
    DescriptionAttributesComponent,
    ProductMassManagerComponent,
    MaterialMassManagerComponent,
    WebPosComponent,
    ReportMenuComponent,
    SalesReportsSubMenuComponent,
    InventoryReportsSubMenuComponent,
    ProductionReportsSubMenuComponent,
  ],
  exports: [ UserProfileComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    StoreModule.forRoot({}, {}),
    RouterModule.forRoot([
      {path : 'home', component : DashboardComponent},
      {path : 'user-profile', component :UserProfileComponent},
      {path : 'role-manager', component :RoleManagerComponent},
      {path : 'access-control', component :AccessContolComponent},
      {path : 'boimetrics', component :BiometricsComponent},
      {path : 'till-administration', component :TillAdministrationComponent},
      {path : 'company-profile', component :CompanyProfileComponent},
      {path : 'product-master', component :ProductMasterComponent},
      {path : 'product-inquiry', component :ProductInquiryComponent},
      {path : 'department', component :DepartmentComponent},
      {path : 'class', component :ClassComponent},
      {path : 'sub-class', component :SubClassComponent},
      {path : 'material-master', component :MaterialMasterComponent},
      {path : 'material-inquiry', component :MaterialInquiryComponent},
      {path : 'category', component :CategoryComponent},
      {path : 'sub-category', component :SubCategoryComponent},
      {path : 'description-attributes', component :DescriptionAttributesComponent},
      {path : 'product-mass-manager', component :ProductMassManagerComponent},
      {path : 'material-mass-manager', component :MaterialMassManagerComponent},
      {path : 'web-pos', component :WebPosComponent},
      {path : 'sales-reports-sub-menu', component :SalesReportsSubMenuComponent},
      {path : 'inventory-reports-sub-menu', component :InventoryReportsSubMenuComponent},
      {path : 'production-reports-sub-menu', component :ProductionReportsSubMenuComponent}
    ]),
    BrowserAnimationsModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    DatePipe,
    JwtHelperService,
   // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
   // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
