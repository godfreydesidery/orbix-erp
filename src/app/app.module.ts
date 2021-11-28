import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './menu/main-menu/main-menu.component';
import { AdminMenuComponent } from './menu/admin-menu/admin-menu.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { RoleManagerComponent } from './user/role-manager/role-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    MainMenuComponent,
    AdminMenuComponent,
    SideBarComponent,
    UserProfileComponent,
    RoleManagerComponent,   
  ],
  exports: [ UserProfileComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    StoreModule.forRoot({}, {}),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
