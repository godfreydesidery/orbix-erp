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
import { MaterialCategoryComponent } from './inventory/material-category/material-category.component';
import { MaterialSubCategoryComponent } from './inventory/material-sub-category/material-sub-category.component';
import { MechandizerMenuComponent } from './menu/mechandizer-menu/mechandizer-menu.component';

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
    MaterialCategoryComponent,
    MaterialSubCategoryComponent,
    MechandizerMenuComponent,
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
      {path : 'product-master', component :ProductMasterComponent},
      {path : 'product-inquiry', component :ProductInquiryComponent},
      {path : 'department', component :DepartmentComponent},
      {path : 'class', component :ClassComponent},
      {path : 'sub-class', component :SubClassComponent},
      {path : 'material-master', component :MaterialMasterComponent},
      {path : 'material-category', component :MaterialCategoryComponent},
      {path : 'material-sub-category', component :MaterialSubCategoryComponent}
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
